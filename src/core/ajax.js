import CacheServer from 'server/cache';
import Util from 'core/util';
let timers = {};
let ajaxQueue = {};
const noop = () => {}

class Ajax{

	reject = (response) => {
		return Promise.reject(response);
	}

	statusVerify = (response) => {
		if(response.status >= 200 && response.status < 300 ){
	        return Promise.resolve(response.json());
	    }
	    else{
	    	console.error(response.status, response.url);
	    	Util.error("服务器开小差啦~请稍后再试!");
	        return Promise.reject(response);
	    }
	}

	resultVerify = (response) => {
		if(response.code && response.code == 302){
			Util.error(response.msg,"稍后将跳转登陆页面~");
			setTimeout(() => {
				location.href = response.data.redirect + '?redirect=' + location.href;
			},3000);
		}else if(response.code && response.code != 1001){
			Util.error(response.msg);
			return Promise.reject(response);
		}else{
			return Promise.resolve(response);
		}
	}

	getCache = (url, data, expire) => {
		let name = url+"___"+ Util.param(data||{})
		if(CacheServer.get(name)){
			return CacheServer.get(name)
		}else{
			let promise = this.get(url,data);
			CacheServer.update(name, promise, expire);
			return promise;
		}
	}

	//重新包装扩展 fetch 为了兼容可以中断请求
	fetch = (url,data) => {
		let abortFn = null;
		let fetchPromise = fetch(url, data);
		let abortPromise = new Promise((resolve, reject) => {
			abortFn = () => { reject(url) }
		})
		//这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
		let _fetch = Promise.race([fetchPromise, abortPromise]);
		_fetch.abort = abortFn;
		return _fetch
	}

	get = (url, data, canAbort) => {
		let _data = data;
		let _param = data && Object.keys(data).length > 0 ? '?'+ Util.param(_data):'';
		let fetch = canAbort ? this.fetch : window.fetch;
		ajaxQueue[url] = fetch(url+_param,{
			method:'GET',
			credentials: 'include',
			headers: { "Content-Type" : "application/x-www-form-urlencoded","X-Requested-With":"XMLHttpRequest" }
		});
		return ajaxQueue[url].then(this.statusVerify, this.reject).then(this.resultVerify, this.reject);
	}

	post = (url, data, canAbort) => {
		let _data = JSON.stringify(data);
		let fetch = canAbort ? this.fetch : window.fetch;
		ajaxQueue[url] = fetch(url,{
			method:'POST',
			credentials: 'include',//用于跨域请求时候带cookie
			headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
			body:_data
		});
		return ajaxQueue[url].then(this.statusVerify, this.reject).then(this.resultVerify, this.reject);
	}

	upload = (url, file, data) => {
		let fileData = new FormData();
		fileData.append('file', file);
		for (var key in data){
			fileData.append(key,data[key]);
		}
		return window.fetch(url, {
		  	method: 'POST',
		  	body: fileData,
		  	credentials: 'include',
		  	headers: { 
		  		"X-Requested-With": "XMLHttpRequest"
		  	}
		}).then(this.statusVerify, this.reject).then(this.resultVerify, this.reject)
	}

	delay = (url, data, time, sucess, fail) => {
		if(timers[url]){
			clearTimeout(timers[url]);
		}
		timers[url] = setTimeout(() => {
			clearTimeout(timers[url]);
			return this.get(url, data).then(sucess, fail);
		}, time || 300);
	}

	abort = (url) => {
		if(url && ajaxQueue[url]){
			ajaxQueue[url].abort();
		}else{
			for(var url in ajaxQueue){
				ajaxQueue[url] && ajaxQueue[url].abort && ajaxQueue[url].abort();
			}
		}
	}
}
export default new Ajax;