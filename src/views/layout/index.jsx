import React, { Component } from 'react'
import { Link } from  'react-router'
import classNames from 'classnames'
import Icon from 'components/icon'

export default class Layout extends Component {
	state = {
		tabBarDataList: [
			{link: "/apply", tabName: "申请", icon: "waiting-circle", key:"Apply"},
			{link: "/audit", tabName: "待审批", icon: "download", key:"Audit"},
			{link: "/audited", tabName: "已审批", icon: "waiting", key:"Audited"},
			{link: "/application", tabName: "我", icon: "circle", key:"Application"}
		],
		activeMenu: "Home"
	}

	constructor(props){
		super(props);
		this.state.activeMenu = ""
	}

	componentWillReceiveProps(nextProps) {
	    this.state.activeMenu = ""
	}

	render() {
		let { children } = this.props;
		let tabBarDataList = this.state.tabBarDataList;
		console.log(this.props);
		return (
			<div className="weui-tab">
				<div className="weui-tab__panel">
	            	{ children }
	            </div>
	            <div className="weui-tabbar">
	            	<For each = "item" of = { tabBarDataList } index = "index">
		                <Link to={item.link} className={classNames({"weui-bar__item_on":this.state.activeMenu==item.key},"weui-tabbar__item")} key={item.key}>
		                	<Icon name={item.icon} className="weui-tabbar__icon"/>
		                    <p className="weui-tabbar__label">{item.tabName}</p>
		                </Link>
	                </For>
	            </div>
			</div>
		)
	}
}


