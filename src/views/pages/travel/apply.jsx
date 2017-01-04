import React, { Component } from 'react';
import BaseComponent from 'core/baseComponent';
import Ajax from 'core/ajax';
import Util from 'core/util';
import Global from 'server/global';

export default class TravelApply extends BaseComponent {
	state = {
		deptList: [],
		params: {
			nickName: "",
			outlineType: "5",
			balanceDate: "",
			regionCode: "",
			companyId: ""
		}
	}

	componentDidMount() {
		let deptListPromise = Global.getDept();
		let getCurrentUserPromise = Global.getCurrentUser();
		Promise.all([deptListPromise, getCurrentUserPromise]).then(res => {
			this.state.deptList = res[0].data.list || [];
			this.state.params.nickName = res[1].data.nickName;
			this.state.params.deptId = res[1].data.biz1thDeptId;
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
		                    <input className="weui-input" type="string" value={ params.nickName } onChange={(e) => { params.nickName = e.target.value; this.setState(this.state);}}/>
		                </div>
		            </div>
		            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="dept" className="weui-label">部门</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <select className="weui-select" name="dept" value={params.deptId} onChange={ (e) => { params.deptId = e.target.value; this.setState(this.state);}}>
		                    	<For each = "item" of = { deptList } index = "index">
		                    		<option value={ item.deptId } key={index}>{ item.deptName }</option>
		                    	</For>
		                    </select>
		                </div>
		            </div>
		        </div>
		        <div className="weui-cells__title">出行信息</div>
			</div>
		)
	}
}