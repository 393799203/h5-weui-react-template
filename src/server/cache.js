/**=============================================================================
#	  FileName: cache.js
#		  Desc: 缓存服务
#		Author: teni
#		 Email: teni@mogujie.com
#	  HomePage: https://github.com/putten
#	   Version: 0.0.1
#	LastChange: 2016-06-20 15:41:22
#	   History:
=============================================================================*/
import BaseServer from 'core/baseServer';

let cacheList = {a:1};
class CacheServer extends BaseServer{
	//页面缓存
	update(name,value,expire){
		let cached = this.get(name);
		let cache = {
			value:value
		}
		//如果设置持久缓存，并且设置过生存时间，清空
		if((!expire || expire <0) && cached && cached.timeout){
			clearTimeout(cached.timeout);
		}
		if(expire>0){
			if(cached && cached.timeout){
				cache.timeout = cached.timeout;
			}else{
				cache.timeout = setTimeout(()=>{
					this.del(name)
				},expire*1000)
			}
		}
		cacheList[name] = cache;
	}
	get(name){
		return cacheList[name];
	}
	getValue(name){
		let cache = this.get(name) || {};
		return cache.value;
	}
	del(name){
		clearTimeout(cacheList[name].timeout)
		delete(cacheList[name])
	}
	clean(){
		Object.keys(cacheList).forEach((i)=>{
			this.del(i)
		})
	}
}

let cacheServer  = new CacheServer;
export default cacheServer;
