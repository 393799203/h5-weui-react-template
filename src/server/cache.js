/**=============================================================================
#	  FileName: cache.js
#		  Desc: promise缓存服务
#		Author: qingmeng
#		 Email: qingmeng@mogujie.com
#	  HomePage: https://github.com/putten
#	   Version: 0.0.1
#	LastChange: 2016-09-28 15:41:22
#	   History:
=============================================================================*/
import BaseServer from 'core/baseServer';

let cacheList = {a:1};
class CacheServer extends BaseServer{
	//缓存请求Promise
	update(name, promise, expire){
		let cached = this.get(name);
		let cache = {
			name: name,
			promise: promise
		}
		//如果设置持久缓存,并且设置过生存时间,清空生存时间,永久存储
		if((!expire || expire <0) && cached && cached.timeout){
			clearTimeout(cached.timeout);
		}
		if(expire>0){
			if( cached && cached.timeout ){
				cache.timeout = cached.timeout;
			}else{
				cache.timeout = setTimeout(()=>{
					this.del(name)
				}, expire )
			}
		}
		cacheList[name] = cache;
	}
	//获得请求的promise
	get(name){
		return cacheList[name]? cacheList[name].promise : null;
	}
	//删除缓存的promise
	del(name){
		clearTimeout(cacheList[name].timeout)
		delete(cacheList[name])
	}
	//清空缓存队列
	clean(){
		Object.keys(cacheList).forEach((i)=>{
			this.del(i)
		})
	}
}
export default new CacheServer
