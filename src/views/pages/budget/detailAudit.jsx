import React, { Component } from 'react'
import classnames from 'classnames';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class ExpenseDetail extends BaseComponent {
	
	state = {
		detailInfo: {},
		showAudit: false,
		disabled: false
	}

	constructor(props){
		super(props);
		Util.setTitle("预算详情");
	}

	componentDidMount() {
	 	Util.startLoading();
		Ajax.get("/api/budget/budgetrequest/detail", {id: this.props.params.id, updated: this.props.location.query.updated}).then((res)=>{
			this.state.detailInfo = res.data;
			if(this.props.route.path.indexOf('audit') != -1){
				this.state.showAudit = true;
			}
			this.setState(this.state);
			Util.closeLoading();
		}, (err) => {
			setTimeout(()=>{
				if(this.props.route.path.indexOf('audit') != -1){
					Util.popWindow("/budget/audit");
				}else{
					Util.popWindow("/budget/audited");
				}
			}, 2000)
		});     
	}

	audit = (status) => {
		if(status == "fail" && !this.refs.auditTextarea.value){
			Util.error("驳回意见不能为空~", 1500);
			return;
		}
		let currTask = Object.assign({},this.state.detailInfo.currTask, {action: status, comment: this.refs.auditTextarea.value})
		let postData = {
			id: this.state.detailInfo.id,
			updated: this.state.detailInfo.updated,
			status: this.state.detailInfo.status,
			currTask: currTask
		}
		Util.startLoading();
		this.state.disabled = true;
		this.setState(this.state);
		Ajax.post("/api/fund/transfer/audit",postData).then((res)=>{
			Util.sendNotification("reload");
			Util.success("操作成功", 1500, ()=>{
				Util.popWindow("/budget/audit");
			});
		}, (err) => {
			this.state.disabled = false;
			this.setState(this.state);
		});
	}

	render() {
		let detailInfo = this.state.detailInfo;
		let showAudit = this.state.showAudit;
		let disabled = this.state.disabled;
		return (
			<div className="expense-detail">
				<div className="weui-cells__title">基本信息</div>
				<div className="weui-cells m-t-n bg-white">
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>申请人</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.applyNickname}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>申请部门</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.deptName}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>编制时间</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.budgetYear}-{detailInfo.budgetQuarter}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>申请时间</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.applyDate}</div>
		            </div>
		        </div>
	        	<div className="weui-cells__title">详细预算信息</div>
	        	<div className="weui-cells m-t-n">
		        	<For each = "item" of = { detailInfo.budgetRequestItemFormList || [] } index = "index">
			        	<div className={classnames("bg-white", {"m-b": index != detailInfo.budgetRequestItemFormList.length -1})} key={ index }>
			        		<div className="weui-cell">
				                <div className="weui-cell__bd">
				                    <div className="pull-left">预算类目</div>
				                    <div className="pull-right m-r-sm text-light">{item.budgetCategoryName}</div>
				                </div>
				                <div className="weui-cell__bd">
				                    <div className="pull-left m-l-sm">费用合计</div>
				                    <div className="pull-right text-light">￥{Util.money(item.totalSum)}</div>
				                </div>
				            </div>
				            <div className="weui-cell">
				            	<div className="weui-cell__bd">
				                    <div className="pull-left">Q1</div>
				                    <div className="pull-right m-r-sm text-light">￥{Util.money(item.q1Sum)}</div>
				                </div>
				                <div className="weui-cell__bd">
				                    <div className="pull-left m-l-sm">Q2</div>
				                    <div className="pull-right text-light">￥{Util.money(item.q2Sum)}</div>
				                </div>
				            </div>
				            <div className="weui-cell">
				            	<div className="weui-cell__bd">
				                    <div className="pull-left">Q3</div>
				                    <div className="pull-right m-r-sm text-light">￥{Util.money(item.q3Sum)}</div>
				                </div>
				                <div className="weui-cell__bd">
				                    <div className="pull-left m-l-sm">Q4</div>
				                    <div className="pull-right text-light">￥{Util.money(item.q4Sum)}</div>
				                </div>
				            </div>
			        	</div>
		            </For>
		        </div>
		        <If condition = {showAudit}>
			        <div className="auditArea">
			        	<div className="weui-cells weui-cells_form">
				            <div className="weui-cell">
				                <div className="weui-cell__bd">
				                    <textarea className="weui-textarea" placeholder="请输入文本" rows="3" ref="auditTextarea"></textarea>
				                </div>
				            </div>
				        </div>
				        <div className="weui-flex p-xs">
				        	<div className="weui-flex__item">
				        		<a href="javascript:;" className={classnames("weui-btn", "weui-btn_primary", "m-xs", {"weui-btn_disabled": disabled})} onClick={this.audit.bind(this, "pass")}>同意</a>
				        	</div>
				        	<div className="weui-flex__item">
				        		<a href="javascript:;" className={classnames("weui-btn", "weui-btn_warn", "m-xs", {"weui-btn_disabled": disabled})} onClick={this.audit.bind(this, "fail")}>驳回</a>
				        	</div>
				        </div>
			        </div>
		        </If>
			</div>
		)
	}
}
