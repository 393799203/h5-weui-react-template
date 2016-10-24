/**=============================================================================
#	  FileName: ajax.js
#		  Desc: ajax 组件，使用fetch做底层，对外封装
#		Author: teni
#		 Email: teni@mogujie.com
#	  HomePage: https://github.com/putten
#	   Version: 0.0.1
#	LastChange: 2016-06-03 09:55:44
#	   History:
=============================================================================*/

import CacheServer from 'server/cache';
import Util from 'core/util';

class Ajax{
	onError(e){
	}
	resultVerify(res){
		if(!res.success){
			if(res.code && res.code === 302){
				//刷新页面 跳转登录页面
				location.href = location.href;
				throw(new Error("未登录"))
			}
			Util.error(res.msg)
			throw(new Error(res.msg))
		}
	}
	get(url,data,autoError = true){
		let _data = data;
		let _param = data && Object.keys(data).length > 0 ? '?'+$.param(_data):'';
		let p = fetch(url+_param,{
			method:'GET',
			credentials: 'include',
			headers: { "Content-Type" : "application/x-www-form-urlencoded" }
		}).then((data)=>{
			return data.json();
		}).catch(this.onError)

		return p.then((res)=>{
			if(autoError){
				this.resultVerify(res);
			}
			return res;
		})
	}
	postUrl(url,data,autoError = true){
		let p = fetch(url,{
			method:'POST',
			credentials: 'include',
			headers: { "Content-Type" : "application/x-www-form-urlencoded","X-Requested-With":"XMLHttpRequest" },
			body:$.param(data)
		}).then((data)=>{
			return data.json();
		}).catch(this.onError)

		return p.then((res)=>{
			if(autoError){
				this.resultVerify(res);
			}
			return res;
		})
	}
	post(url,data,autoError = true){
		let p = fetch(url,{
			method:'POST',
			credentials: 'include',
			headers: { "Content-Type" : "application/json" },
			body:JSON.stringify(data)
		}).then((data)=>{
			return data.json();
		}).catch(this.onError)

		return p.then((res)=>{
			if(autoError){
				this.resultVerify(res);
			}
			return res;
		})
	}
	fetch(url,data){
		return fetch(url,data);
	}
	//带缓存的请求
	getCache(url,data,expire){
		let name = url+"___"+$.param(data||{})
		if(CacheServer.get(name)){
			return new Promise((resolve,reject)=>{
				resolve(CacheServer.getValue(name))
			})
		}
		return this.get(url,data).then((res)=>{
			CacheServer.update(name,res,expire)
			return res;
		})
	}
}
let ajax = new Ajax;
export default ajax;
