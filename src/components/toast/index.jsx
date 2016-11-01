import React, { Component } from 'react'
import { Link } from  'react-router';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import Icon from 'components/icon';

export default class Toast extends Component {
	static init(){
		if(!this.node){
			this.node = document.createElement('div');
			document.getElementsByTagName('body')[0].appendChild(this.node);
		}
	}

	static open(options){
		this.init();
		ReactDOM.render(<Toast {...options} />, this.node);
		if(options.duration){
			clearTimeout(this.timeout)
			this.timeout = setTimeout(()=>{
				this.close();
				options.callback && options.callback();
			}, options.duration);
		}
	}

	static close(){
		ReactDOM.unmountComponentAtNode(this.node);
	}

	render() {
		let cls = "";
		let msg = "";
		switch(this.props.type){
			case "loading" : cls = "weui-loading"; msg = this.props.msg || "数据加载中" ;break;
			case "success" : cls = "weui-icon-success-no-circle"; msg = this.props.msg || "已完成"; break;
			case "error" : msg = this.props.msg || "服务器开小差啦~请稍后再试"; break;
		}
		return (
			<div id="Toast">
		        <div className="weui-mask_transparent"></div>
		        <If condition={this.props.type != "error"}>
			        <div className="weui-toast">
			            <i className={classnames("weui-icon_toast", cls)}></i>
			            <p className="weui-toast__content">{ msg }</p>
			        </div>
		        <Else/>
		        	<div className="weui-tips">
			            <p className="weui-tips__content">{ msg }</p>
			        </div>
		        </If>
		    </div>
		)
	}
}
