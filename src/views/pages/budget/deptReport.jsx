import React, { Component } from 'react'
import { browserHistory, Link } from  'react-router'
import classnames from 'classnames';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';
import Global from 'server/global';

export default class DeptReport extends BaseComponent {
	state = {
		deptList : [],
		budgetYearList: [],
		budgetQuarterList: [],
		params: {
			deptId: "",
			budgetYear: "",
			budgetQuarter: ""
		},
		detailList : []
	}

	constructor(props){
		super(props);
		Util.setTitle("部门预算");
	}

	componentDidMount() {
		let allEnumMapsPromise = Global.getAllEnumData();
		let deptListPromise = Global.getDept();
		let getCurrentUserPromise = Global.getCurrentUser();
		Promise.all([allEnumMapsPromise, deptListPromise, getCurrentUserPromise]).then(res => {
			this.state.budgetYearList = res[0].data.map.budgetYear || [];
			this.state.budgetQuarterList = res[0].data.map.budgetQuarter || [];
			this.state.deptList = res[1].data.list || [];
			this.state.params.deptId = res[2].data.biz1thDeptId;
			this.state.params.budgetYear = moment().format('YYYY');
			this.state.params.budgetQuarter = 'Q' + moment().quarter();
			this.getDetailList();
		})
		document.addEventListener("reload", function(data){
			window.location.reload();
		}, false);
	}

	getDetailList = () => {
		Ajax.get('/api/budget/budgetrequest/getDeptBudgetDetail',{...this.state.params}).then(res => {
			console.log(res);
			this.state.detailList = res.data.list || [];
			this.setState(this.state);
		})
	}

	render() {
		let { budgetYearList, budgetQuarterList, deptList, params, detailList } = this.state;
		return (
			<div className="report">
				<div className="weui-cells__title">查询条件</div>
				<div className="weui-cells m-t-n ">
					<div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="dept" className="weui-label">部门</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <select className="weui-select" name="dept" value={params.deptId}>
		                    	<For each = "item" of = { deptList } index = "index">
		                    		<option value={ item.deptId } key={index}>{ item.deptName }</option>
		                    	</For>
		                    </select>
		                </div>
		            </div>
		            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="year" className="weui-label">年度</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <select className="weui-select" name="year" value={params.budgetYear}>
		                    	<For each = "item" of = { budgetYearList } index = "index">
		                    		<option value={ item.itemKey } key={index}>{ item.itemValue }</option>
		                    	</For>
		                    </select>
		                </div>
		            </div>
		            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
		            	<div className="weui-cell__hd">
		                    <label htmlFor="quarter" className="weui-label">季度</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <select className="weui-select" name="quarter" value={params.budgetQuarter}>
		                    	<For each = "item" of = { budgetQuarterList } index = "index">
		                    		<option value={ item.itemKey } key={index}>{ item.itemValue }</option>
		                    	</For>
		                    </select>
		                </div>
		            </div>
				</div>
				<div className="weui-cells__title">预算明细</div>
				<div className="weui-cells m-t-n">
					<For each = "item" of = { detailList || [] } index = "index">
						<div className={classnames("bg-white", {"m-b": index != detailList.length -1})} key={ index }>
			        		<div className="weui-cell">
				                <div className="weui-cell__bd">
				                    <div className="pull-left">预算类目</div>
				                    <div className="pull-right text-light">{item.budgetCategoryName}</div>
				                </div>
				            </div>
			        	</div>
					</For>
				</div>
			</div>
		)
	}
}