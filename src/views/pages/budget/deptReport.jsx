import React, { Component } from 'react'
import { browserHistory, Link } from  'react-router'
import classnames from 'classnames';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class DeptReport extends BaseComponent {
	state = {
		deptList : []
	}

	constructor(props){
		super(props);
		Util.setTitle("部门预算");
	}

	componentDidMount() {
		Ajax.get('/api/dept/getBiz1thDept',{}).then(res => {
			this.state.deptList = res.data.list || [];
			this.setState(this.state.deptList);
		})
		document.addEventListener("reload", function(data){
			window.location.reload();
		}, false);
	}

	render() {
		let deptList = this.state.deptList;
		let budgetRequestItemShipDtoList = [];
		return (
			<div className="report">
				<div className="weui-cells__title">查询条件</div>
				<div className="weui-cells m-t-n ">
					<div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="dept" className="weui-label">部门</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <select className="weui-select" name="dept">
		                    	<option value="" key="">请选择</option>
		                    	<For each = "item" of = { deptList } index = "index">
		                    		<option value={ item.deptId } key={index}>{ item.deptName }</option>
		                    	</For>
		                    </select>
		                </div>
		            </div>
				</div>
				<div className="weui-cells__title">预算明细</div>
				<div className="weui-cells m-t-n">
					<For each = "item" of = { budgetRequestItemShipDtoList || [] } index = "index">
						<div className={classnames("bg-white", {"m-b": index != budgetRequestItemShipDtoList.length -1})} key={ index }>
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