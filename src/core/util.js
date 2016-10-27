import { hashHistory } from 'react-router';
import valueData from 'data/values';

//基础工具
class Util{

	parseContent = (str) => {
		return {
			__html:str
		}
	}

	scrollToTop = () => {
		window.scrollTo(window.scrollX,0);
	}

	trim = (str) => {
		return str.replace(/(^\s*)|(\s*$)/g,"");
	}

	/**
	 * param 将要转为URL参数字符串的对象
	 * key URL参数字符串的前缀
	 * encode true/false 是否进行URL编码,默认为true
	 * 
	 * return URL参数字符串
	 */
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

	toastr = (type, msg, desc, duration, other) => {
		console.log(msg);
		// notification[type](Object.assign({
		// 	message: msg,
		// 	description: desc,
		// 	duration: duration || 4
		// },other))
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

	success = (msg, desc, duration) => {
		this.toastr("success", msg, desc, duration)
	}

	error = (msg, desc, duration) => {
		this.toastr("error", msg, desc, duration)
	}

	info = (msg, desc, duration) => {
		this.toastr("info", msg, desc, duration)
	}

	warning = (msg, desc, duration) => {
		this.toastr("warning", msg, desc, duration)
	}
}
export default new Util;

