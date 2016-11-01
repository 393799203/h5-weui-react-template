import React, { Component } from 'react'
import { Link } from  'react-router'
import classNames from 'classnames'
import Icon from 'components/icon'
const ActiveArray = [];

export default class Layout extends Component {
	state = {
		tabBarDataList: [
			/* {link: "/", tabName: "申请", icon: "waiting-circle", key: "apply"}, */
			{link: "/audit", tabName: "待审批", icon: "waiting-circle", key: "audit"},
			{link: "/audited", tabName: "已审批", icon: "info-circle", key: "audited"},
			{link: "/application", tabName: "我的", icon: "circle", key: "application"}
		],
		activeMenu: ""
	}

	constructor(props){
		super(props);
		this.state.tabBarDataList.map((item, index)=>{
			ActiveArray.push(item.key);
		});
		this.selectActiveMenu(props);
	}

	componentWillReceiveProps(nextProps) {
	    this.selectActiveMenu(nextProps);
	}

	selectActiveMenu = (props) => {
		this.state.activeMenu = props.location.pathname.split('/')[1] || "apply";
	}

	render() {
		let { children } = this.props;
		let tabBarDataList = this.state.tabBarDataList;
		if(ActiveArray.includes(this.state.activeMenu)){
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
		}else{
			return (
				<div className="containerWrap">
					{ children }
				</div>
			)
		}
	}
}


