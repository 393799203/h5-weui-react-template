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
		allCompanyList : [],
		companyList : [],
		params: {
			outlineType: "5",
			balanceDate: "",
			regionCode: "",
			companyId: ""
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
		Util.startLoading();
		Promise.all([allEnumMapsPromise, companyPromise]).then(res => {
			this.state.currencyList = res[0].data.map.currency;
			this.state.companyList = this.state.allCompanyList = res[1].data.list || [];
			this.getDetailList(); 
		}, (err) => {
			Util.popWindow("/query");
		})
	}

	getDetailList = () => {
		if(this.state.params.regionCode){
			this.state.companyList = this.state.allCompanyList.filter((item) => {
				return item.regionCode == this.state.params.regionCode
			});
		}else{
			this.state.companyList = this.state.allCompanyList;
		}
		Util.startLoading();
		let postData = this.state.firstLoaded? Object.assign({}, this.state.params, {balanceDate: moment(this.state.params.balanceDate, 'YYYY-MM-DD').format('YYYYMMDD')}) : Object.assign({}, this.state.params);
		Ajax.post('/api/fund/fundDailyBalance/statisticalReportMobile', postData).then(res => {
			Util.closeLoading();
			this.state.firstLoaded = true;
			this.state.params.balanceDate = res.data.object? moment(res.data.object, "YYYYMMDD").format("YYYY-MM-DD") : this.state.params.balanceDate,
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
		                    <select className="weui-select" name="quarter" value={ params.companyId } onChange={ (e) => { params.companyId = e.target.value; this.getDetailList() }}>
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
						<div className="weui-cells__title">{detail.companyName}</div>
						<div className="weui-cells m-t-n">
							<div className={classnames("bg-white", {"m-b": index != detailList.length -1})} key={ index }>
				        		<div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <div className="pull-left">美元</div>
					                    <div className="pull-right m-r-sm text-light">{Util.money(detail.dollar4USD)}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left">人民币</div>
					                    <div className="pull-right text-light">{Util.money(detail.renMinBi4CNY)}</div>
					                </div>
					            </div>
				        	</div>
						</div>
					</For>
				</If>
				<BackTop/>
			</div>
		)
	}
}