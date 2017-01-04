import React, { Component } from 'react';
import BaseComponent from 'core/baseComponent';
import Ajax from 'core/ajax';
import Util from 'core/util';
import Global from 'server/global';

export default class TravelApply extends BaseComponent {
	state = {
		params: {
			nickName: ""
		}
	}

	componentDidMount() {
		let getCurrentUserPromise = Global.getCurrentUser();
		Promise.all([getCurrentUserPromise]).then(res => {
			this.state.params.nickName = res[0].data.nickName;
			this.state.params.deptName = res[0].data.biz1thDeptName;
			this.setState(this.state);
		}, (err) => {
			setTimeout(()=>{
				Util.popWindow("/apply");
			}, 2000);
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
		                    <label htmlFor="date" className="weui-label">申请人</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <input className="weui-input" type="text" value={ params.nickName } disabled/>
		                </div>
		            </div>
		            <div className="weui-cell bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="date" className="weui-label">部门</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <input className="weui-input" type="text" value={ params.deptName } disabled/>
		                </div>
		            </div>
		        </div>
		        <div className="weui-cells__title">出行信息</div>
			</div>
		)
	}
}