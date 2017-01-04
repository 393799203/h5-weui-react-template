import React, { Component } from 'react'

export default class Test extends Component {
	state = {
		deptList: [],
		params: {
			applyName: "",
			outlineType: "5",
			balanceDate: "",
			regionCode: "",
			companyId: ""
		}
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
		                    <input className="weui-input" type="string" value={ params.applyName } onChange={(e) => { params.applyName = e.target.value; this.setState(this.state);}}/>
		                </div>
		            </div>
		            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="dept" className="weui-label">部门</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <select className="weui-select" name="dept" value={params.deptId} onChange={ (e) => { params.deptId = e.target.value; this.getDetailList() }}>
		                    	<For each = "item" of = { deptList } index = "index">
		                    		<option value={ item.deptId } key={index}>{ item.deptName }</option>
		                    	</For>
		                    </select>
		                </div>
		            </div>
		        </div>
			</div>
		)
	}
}