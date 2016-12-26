import React, { Component } from 'react'
import { browserHistory, Link } from  'react-router'
import classnames from 'classnames';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';
import Global from 'server/global';
import BackTop from 'components/backtop';

export default class DeptReport extends BaseComponent {
	state = {
		deptList : [],
		budgetYearList: [],
		budgetQuarterList: [],
		params: {
			deptId: "",
			budgetYear: "",
			budgetQuarter: "",
			isContainWaitingDocument: false
		},
		detailList : [],
		firstLoaded : false
	}

	constructor(props){
		super(props);
		Util.setTitle("部门预算");
	}

	componentDidMount() {
		let allEnumMapsPromise = Global.getAllEnumData();
		let deptListPromise = Global.getBudgetDept();
		let getCurrentUserPromise = Global.getCurrentUser();
		Util.startLoading();
		Promise.all([allEnumMapsPromise, deptListPromise, getCurrentUserPromise]).then(res => {
			this.state.budgetYearList = res[0].data.map.budgetYear || [];
			this.state.budgetQuarterList = res[0].data.map.budgetQuarter || [];
			this.state.deptList = res[1].data.list || [];
			this.state.params.deptId = res[2].data.biz1thDeptId;
			this.state.params.budgetYear = moment().format('YYYY');
			this.state.params.budgetQuarter = 'Q' + moment().quarter();
			this.getDetailList();
		}, (err) => {
			setTimeout(()=>{
				Util.popWindow("/query");
			}, 2000);
		})
	}

	getDetailList = () => {
		Util.startLoading();
		Ajax.get('/api/budget/budgetrequest/getDeptBudgetDetail',{...this.state.params}).then(res => {
			Util.closeLoading();
			this.state.firstLoaded = true;
			this.state.detailList = res.data || [];
			this.setState(this.state);
		}, (err) => {
			setTimeout(()=>{
				Util.popWindow("/query");
			}, 2000);
		})
	}

	render() {
		let { budgetYearList, budgetQuarterList, deptList, params, detailList, firstLoaded } = this.state;
		return (
			<div className="report">
				<div className="weui-cells__title">查询条件</div>
				<div className="weui-cells m-t-n ">
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
		            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="year" className="weui-label">年度</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <select className="weui-select" name="year" value={params.budgetYear} onChange={ (e) => { params.budgetYear = e.target.value; this.getDetailList() }}>
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
		                    <select className="weui-select" name="quarter" value={params.budgetQuarter} onChange={ (e) => { params.budgetQuarter = e.target.value; this.getDetailList() }}>
		                    	<For each = "item" of = { budgetQuarterList } index = "index">
		                    		<option value={ item.itemKey } key={index}>{ item.itemValue }</option>
		                    	</For>
		                    </select>
		                </div>
		            </div>
				</div>
				<div className="weui-cells__title">查询结果</div>
				<If condition = { firstLoaded && !detailList.length }>
					<div className="weui-loadmore weui-loadmore_line">
			            <span className="weui-loadmore__tips">暂无数据</span>
			        </div>
		        <Else />
					<For each = "detail" of = { detailList } index = "index">
						<div className="weui-cells__title">{detail.budgetCategoryName}</div>
						<div className="weui-cells m-t-n">
							<For each = "item" of = {detail.itemList || []}>
								<div className={classnames("bg-white", {"m-b": index != detail.itemList.length -1})} key={ index }>
					        		<div className="weui-cell">
						                <div className="weui-cell__bd">
						                    <div className="pull-left">预算类</div>
						                    <div className="pull-right m-r-sm text-light">{item.budgetCategoryName}</div>
						                </div>
						                <div className="weui-cell__bd">
						                    <div className="pull-left">年度合计</div>
						                    <div className="pull-right text-light">
						                    ￥{Util.money((params.budgetQuarter>'Q1'? item.actualQ1Sum: item.q1Sum) + 
						                    			 (params.budgetQuarter>'Q2'? item.actualQ2Sum: item.q2Sum) + 
						                    			 (params.budgetQuarter>'Q3'? item.actualQ3Sum: item.q3Sum) + 
						                    			 (params.budgetQuarter>'Q4'? item.actualQ4Sum: item.q4Sum))}
						                    </div>
						                </div>
						            </div>
						            <div className="weui-cell">
						            	<div className="weui-cell__bd">
						                    <div className="pull-left">Q1{params.budgetQuarter>'Q1'?'实际': '预算'}</div>
						                    <div className="pull-right m-r-sm text-light">￥{params.budgetQuarter>'Q1'? Util.money(item.actualQ1Sum): Util.money(item.q1Sum)}</div>
						                </div>
						                <div className="weui-cell__bd">
						                    <div className="pull-left m-l-sm">Q2{params.budgetQuarter>'Q2'?'实际': '预算'}</div>
						                    <div className="pull-right text-light">￥{params.budgetQuarter>'Q2'? Util.money(item.actualQ2Sum): Util.money(item.q2Sum)}</div>
						                </div>
						            </div>
						            <div className="weui-cell">
						                <div className="weui-cell__bd">
						                    <div className="pull-left">Q3{params.budgetQuarter>'Q3'?'实际': '预算'}</div>
						                    <div className="pull-right m-r-sm text-light">￥{params.budgetQuarter>'Q3'? Util.money(item.actualQ3Sum): Util.money(item.q3Sum)}</div>
						                </div>
						                <div className="weui-cell__bd">
						                    <div className="pull-left m-l-sm">Q4{params.budgetQuarter>'Q4'?'实际': '预算'}</div>
						                    <div className="pull-right text-light">￥{params.budgetQuarter>'Q4'? Util.money(item.actualQ4Sum): Util.money(item.q4Sum)}</div>
						                </div>
						            </div>
					        	</div>
				        	</For>
						</div>
					</For>
				</If>
				<BackTop/>
			</div>
		)
	}
}