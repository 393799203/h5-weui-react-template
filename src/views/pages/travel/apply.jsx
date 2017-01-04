import React, { Component } from 'react';
import BaseComponent from 'core/baseComponent';
import Ajax from 'core/ajax';
import Util from 'core/util';
import Global from 'server/global';

export default class TravelApply extends BaseComponent {
	state = {
		params: {
			nickName: "",
			deptName: "",
			travellers: []
		}
	}

	componentDidMount() {
		let getCurrentUserPromise = Global.getCurrentUser();
		Promise.all([getCurrentUserPromise]).then(res => {
			this.state.params.nickName = res[0].data.nickName;
			this.state.params.deptName = res[0].data.biz1thDeptName;
			this.state.params.travellers = [res[0].data];
			this.setState(this.state);
		}, (err) => {
			setTimeout(()=>{
				Util.popWindow("/apply");
			}, 2000);
		})
	}

	addUser = () => {
		Util.selectTTContact().then(res => {
			this.state.params.travellers.concat(res);
			this.setState(this.state);
		}, res => {
			Util.error(res)
		})
	}

	render() {
		let { deptList, params } = this.state;
		return (
			<div className="apply">
				<div className="weui-cells__title">基本信息</div>
				<div className="weui-cells m-t-n">
					<div className="weui-cell bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="nickName" className="weui-label">申请人</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <input className="weui-input" type="text" name="nickName" value={ params.nickName } disabled/>
		                </div>
		            </div>
		            <div className="weui-cell bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="dept" className="weui-label">部门</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <input className="weui-input" type="text" name="dept" value={ params.deptName } disabled/>
		                </div>
		            </div>
		        </div>
		        <div className="weui-cells__title">出行信息</div>
		        <div className="weui-cells m-t-n">
		        	<div className="weui-cell bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="traveller" className="weui-label">出行人</label>
		                </div>
		                <div className="weui-cell__bd">
		                	<a href="javascript:;" className="addUser"  onClick={ this.addUser }>添加用户</a>
		                	<For each = "item" of = { params.travellers } index = "index">
		                		<a href="javascript:;" className="delUser">{item.nickName}</a>
		                	</For>
		                </div>
		            </div>
		        </div>
			</div>
		)
	}
}