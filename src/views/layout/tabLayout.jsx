import React, { Component } from 'react'
import { Link } from  'react-router'
import classNames from 'classnames'
import Icon from 'components/icon'

export default class TabLayout extends Component {
	state = {
		tabBarDataList: [
			{link: "/", tabName: "申请", icon: "waiting-circle", key: "apply"},
			{link: "/audit", tabName: "待审批", icon: "download", key: "audit"},
			{link: "/audited", tabName: "已审批", icon: "waiting", key: "audited"},
			{link: "/application", tabName: "我", icon: "circle", key: "application"}
		],
		activeMenu: ""
	}

	constructor(props){
		super(props);
		this.selectActiveMenu(props);
	}

	componentWillReceiveProps(nextProps) {
	    this.selectActiveMenu(nextProps);
	}

	selectActiveMenu = (props) => {
		console.log(props.location.pathname);
		this.state.activeMenu = props.location.pathname.split('/')[1] || "apply";
	}

	render() {
		let { children } = this.props;
		let tabBarDataList = this.state.tabBarDataList;
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


