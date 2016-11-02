import Toast from 'components/toast';

//基础工具
class UtilBase{

	static isTT = () => {
		return UtilBase.inUserAgent(/tt4ios|tt4android/);
	}

	static inUserAgent = (val) => {
        return val.test(navigator.userAgent.toLowerCase());
    }

    trim = (str) => {
		return str.replace(/(^\s*)|(\s*$)/g,"");
	}

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

	rmoney = (s) => {   
	   return parseFloat(s.replace(/[^\d\.-]/g, ""));   
	} 

	toast = (type, msg, duration, callback) => {
		Toast.open({
			type: type,
			msg: msg,
			duration: duration,
			callback: callback
		})
	}

	startLoading = (msg) => {
		this.toast("loading", msg );
	}

	closeLoading = () => {
		Toast.close();
	}

	success = (msg, duration = 3000, callback) => {
		this.toast("success", msg, duration, callback)
	}
	
	error = (msg, duration = 3000, callback) => {
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

    removeNotification = (name) => {}

    sendNotification = (name, data) => {}

    registerNotification = (name) => {}

}

//容器部分
class Hybrid extends UtilBase{

	setTitle = (title, color) => {
        return hdp.do('tt.navigation.setTitle', title, color)
    }

    setRightItemTitle = (title, color) => {
        return hdp.do('tt.navigation.rightitem.setTitle', title, color)
    }

	pushWindow = (url) => {
		return hdp.do('tt.navigation.pushWindow', url);
	}

	popWindow = (url) => {
		return hdp.do('tt.navigation.popWindow');
	}

	removeNotification = (name) => {
        return hdp.do('tt.notification.removeNotification', name)
    }

    sendNotification = (name, data) => {
        return hdp.do('tt.notification.sendNotification', name, data)
    }

    registerNotification = (name) => {
        return hdp.do('tt.notification.registerNotification', name)
    }
}

let isTT = window.hasOwnProperty("hdp") && UtilBase.isTT();
let util = isTT ? (new Hybrid) : (new H5Util);
util.isTT = isTT;
export default util;

