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
		companyList : [],
		params: {
			outlineType: "5",
			balanceDate: moment().add(-1,'days').format("YYYY-MM-DD"),
			regionCode: "",
			companyIds: []
		},
		detailList : [],
		firstLoaded : false
	}

	constructor(props){
		super(props);
		Util.setTitle("资金日报");
	}

	componentDidMount() {
		let allEnumMapsPromise = Global.getAllEnumData();
		let companyPromise = Ajax.get("/api/company/statisticalReportCompany");
		Promise.all([allEnumMapsPromise, companyPromise]).then(res => {
			this.state.currencyList = res[0].data.map.currency;
			this.state.companyList = res[1].data.list || [];
			this.getDetailList(); 
		}, (err) => {
			Util.popWindow("/query");
		})
	}

	getDetailList = () => {
		Util.startLoading();
		let postData = Object.assign({}, this.state.params, {balanceDate: moment(this.state.params.balanceDate, 'YYYY-MM-DD').format('YYYYMMDD')});
		Ajax.post('/api/fund/fundDailyBalance/statisticalReport', postData).then(res => {
			Util.closeLoading();
			this.state.firstLoaded = true;
			this.state.detailList = res.data.list || [];
			this.setState(this.state);
		}, (err) => {
			setTimeout(() => {
				Util.popWindow("/query");
			}, 2000)
		})
	}

	render() {
		let { companyList, params, detailList, firstLoaded } = this.state;
		return (
			<div className="report">
				<div className="weui-cells__title">查询条件</div>
				<div className="weui-cells m-t-n ">
					<div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="date" className="weui-label">余额日期</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <input className="weui-select" name="date" type="date" value={ params.balanceDate } onChange={(e) => { params.balanceDate = e.target.value; this.getDetailList() }}/>
		                </div>
		            </div>
		            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
		                <div className="weui-cell__hd">
		                    <label htmlFor="year" className="weui-label">区域</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <select className="weui-select" name="year" value={params.regionCode} onChange={ (e) => { params.regionCode = e.target.value; this.getDetailList() }}>
		                    	<option key = "" value = "">全部</option>
						    	<option key = "02" value = "02">南区</option>
						    	<option key = "01" value = "01">北区</option>
		                    </select>
		                </div>
		            </div>
		            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
		            	<div className="weui-cell__hd">
		                    <label htmlFor="quarter" className="weui-label">公司</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <select className="weui-select" name="quarter" value={ params.companyIds[0]||'' } onChange={ (e) => { params.companyIds[0] = e.target.value; this.getDetailList() }}>
		                    	<option value="" key="">不限</option>
		                    	<For each = "item" of = { companyList } index = "index">
		                    		<option value={ item.id } key={ index }>{ item.companyName }</option>
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
						                    <div className="pull-left">预算类目</div>
						                    <div className="pull-right m-r-sm text-light">{item.budgetCategoryName}</div>
						                </div>
						                <div className="weui-cell__bd">
						                    <div className="pull-left">年度合计</div>
						                    <div className="pull-right text-light">
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