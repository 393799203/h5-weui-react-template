import React, { Component } from 'react'
import { browserHistory, Link } from  'react-router'
import classNames from 'classnames'
import Icon from 'components/icon'
import Util from 'core/util';

export default class Layout extends Component {

	tabBarDataListAudit = [
		{link: "apply", tabName: "申请", icon: "custom-audit", key: "apply"},
		{link: "audit", tabName: "待审批", icon: "custom-audit", key: "audit"},
		{link: "audited", tabName: "已审批", icon: "custom-audited", key: "audited"},
		{link: "my", tabName: "我的", icon: "custom-my", key: "my"} 
	]

	state = {
		activeArray: [],
		tabBarDataList: [],
		activeMenu: ""
	}

	constructor(props){
		super(props);
		this.state.tabBarDataList = this.tabBarDataListAudit;
		this.state.tabBarDataList.map((item, index)=>{
			this.state.activeArray.push(item.key);
		});
		this.selectActiveMenu(props);
	}

	componentDidMount() {
	    Util.registerNotification("reload").then(success => {
	    	console.log("reload注册成功");
	    }, error => {
	    	console.log("reload注册失败," + error)
	    });
		document.getElementById("appWrapper").addEventListener("click", (e) => {
			let target = e.target;
			if( target && target.nodeName.toLocaleLowerCase() == "a" && target.className.indexOf('pushWindow') != -1 ) {
				e.preventDefault();
				Util.pushWindow(target.href);
				return false;
			}
			if( target && target.nodeName.toLocaleLowerCase() == "a" && target.className.indexOf('replaceHistory') != -1 ) {
				e.preventDefault();
				browserHistory.replace(target.getAttribute("href"));
				return false;
			}
			return true;
		},false);  
	}

	componentWillReceiveProps(nextProps) {
		this.state.activeArray = [];
		this.state.tabBarDataList = this.tabBarDataListAudit;
		this.state.tabBarDataList.map((item, index)=>{
			this.state.activeArray.push(item.key);
		});
	    this.selectActiveMenu(nextProps);
	}

	selectActiveMenu = (props) => {
		let pathArr = props.location.pathname.split('/');
		this.state.activeMenu = pathArr[pathArr.length - 1];
	}

	render() {
		let { children } = this.props;
		let tabBarDataList = this.state.tabBarDataList;
		if(this.state.activeArray.includes(this.state.activeMenu) && this.state.activeArray.length > 1){
			return (
				<div className="weui-tab">
					<div className="weui-tab__panel">
		            	{ children }
		            </div>
		            <div className="weui-tabbar">
		            	<For each = "item" of = { tabBarDataList } index = "index">
			                <Link to={ Util.absoluteUrl(item.link) } className={classNames({"weui-bar__item_on":this.state.activeMenu==item.key},"weui-tabbar__item replaceHistory")} key={item.key}>
			                	<Icon name={item.icon} className="weui-tabbar__icon"/>
			                    <p className="weui-tabbar__label">{item.tabName}</p>
			                </Link>
		                </For>
		            </div>
				</div>
			)
		}else{
			return (
				<div className="containerWrap">
					{ children }
				</div>
			)
		}
	}
}


