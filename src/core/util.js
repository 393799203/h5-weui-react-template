import Toast from 'components/toast';
import FuzzySelect from 'components/fuzzySelect';

//基础工具
class UtilBase{

	static isTT = () => UtilBase.inUserAgent(/tt4ios|tt4android/)

	static inUserAgent = (val) => val.test(navigator.userAgent.toLowerCase())
    
    trim = (str) => str.replace(/(^\s*)|(\s*$)/g,"")

	param = (data, key, encode) => {
	  if( data == null ) return '';
	  var paramStr = '';
	  var t = typeof (data);
	  if (t == 'string' || t == 'number' || t == 'boolean') {
	    paramStr += '&' + key + '=' + ((encode == null||encode) ? encodeURIComponent(data) : data);
	  } else {
	    for (var i in data) {
	      var k = key == null ? i : key + (data instanceof Array ? '[' + i + ']' : '.' + i);
	      paramStr += this.param(data[i], k, encode);
	    }
	  }
	  return paramStr;
	}

	css = (dom,data) => {
		let sty = dom.getAttribute("style");
		let oldSty = this.formatStyle(sty)
		dom.setAttribute("style",this.parseStyle(Object.assign({},oldSty,data)));
	}
	//将字符串解析为style对象
	formatStyle = (data) => {
		if(!data){
			return {};
		}

		let styObj = {}
		data.split(';').filter((v)=>{
			return v;
		}).forEach((v)=>{
			let vArr = v.split(":");
			if(vArr.length == 2 && vArr[0] && vArr[1]){
				styObj[vArr[0]] = vArr[1];
			}
		})
		return styObj;
	}
	
	parseStyle = (data) => {
		let cssNumber = [
			"columnCount",
			"fillOpacity",
			"fontWeight",
			"lineHeight",
			"opacity",
			"order",
			"orphans",
			"widows",
			"zIndex",
			"zoom"
		];
		let prefixList = [
			'transform'
		]
		let styArr = [];
		Object.keys(data).forEach((v)=>{
			if(prefixList.indexOf(v) >= 0){
				data["-webkit-"+v] = data[v];
			}
		})
		Object.keys(data).forEach((v)=>{
			if(typeof(data[v]) == 'number' && cssNumber.indexOf(v) < 0){
				styArr.push(v+":"+data[v]+'px');
			}else{
				styArr.push(v+":"+data[v]);
			}
		})
		return styArr.join(";");
	}

	absoluteUrl = ( url ) => {
		if( url.indexOf('/') == -1 || url.indexOf('/') > 0 ){
			let pathArr = document.location.pathname.split('/');
			pathArr[pathArr.length - 1] = url;
			return pathArr.join('/')
		}else{
			return url;
		}
	}

	money = (s, n) => {
		n = n > 0 && n <= 20 ? n : 2;
	    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";  
	    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];  

	    var t = "";  
	    for (var i = 0; i < l.length; i++) {  
	        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
	    }
	    return t.split("").reverse().join("") + "." + r;
	}

	rmoney = (s) => parseFloat(s.replace(/[^\d\.-]/g, ""))

	toast = (type, msg, duration, callback) => {
		Toast.open({
			type: type,
			msg: msg,
			duration: duration,
			callback: callback
		})
	}

	fuzzySelect = (url, callback) => {
		FuzzySelect.open({
			url: url,
			callback: callback,
			defaulyFocus: true
		})
	}

	startLoading = (msg) => {
		this.toast("loading", msg );
	}

	closeLoading = () => {
		Toast.close();
	}

	success = (msg, duration = 2000, callback) => {
		this.toast("success", msg, duration, callback)
	}
	
	error = (msg, duration = 2000, callback) => {
		this.toast("error", msg, duration, callback)
	}

}

//H5部分
class H5Util extends UtilBase{

	setTitle = (title, color) => {
		document.title = title;
	}

	setRightItemTitle = (title, color) => {}

	pushWindow = (url) => {
		location.href = url;
	}

	popWindow = (url) => {
        location.href = url;
    }

    removeNotification = (name) => { return Promise.reject("非TT环境不能注销通知~") }

    sendNotification = (name, data) => { return Promise.reject("非TT环境不能发送通知~") }

    registerNotification = (name) => { return Promise.reject("非TT环境不能注册通知~") }

    selectTTContact = (users) => { return Promise.reject("非TT环境不能选取用户~") }

}

//容器部分
class Hybrid extends UtilBase{

	setTitle = (title, color) => hdp.do('tt.navigation.setTitle', title, color)
  
    setRightItemTitle = (title, color) => hdp.do('tt.navigation.rightitem.setTitle', title, color)
    
	pushWindow = (url) => hdp.do('tt.navigation.pushWindow', url)

	popWindow = (url) => hdp.do('tt.navigation.popWindow')

	removeNotification = (name) => hdp.do('tt.notification.removeNotification', name)

    sendNotification = (name, data) => hdp.do('tt.notification.sendNotification', name, data)

    registerNotification = (name) => hdp.do('tt.notification.registerNotification', name)

    selectTTContact = (users) => hdp.do('tt.ttcontact.selectMultiContact', users)
    
}

let isTT = window.hasOwnProperty("hdp") && UtilBase.isTT();
let util = isTT ? (new Hybrid) : (new H5Util);
util.isTT = isTT;
export default util;

