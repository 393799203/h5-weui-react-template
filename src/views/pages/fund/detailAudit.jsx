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
		Util.setTitle("资金申请详情");
	}

	componentDidMount() {
	 	Util.startLoading();
		Ajax.get("/api/fund/transfer/detail", {id: this.props.params.id, updated: this.props.location.query.updated}).then((res)=>{
			this.state.detailInfo = res.data;
			if(this.props.route.path.indexOf('audit') != -1){
				this.state.showAudit = true;
			}
			this.setState(this.state);
			Util.closeLoading();
		}, (err) => {
			setTimeout(()=>{
				if(this.props.route.path.indexOf('audit') != -1){
					Util.popWindow("/fund/audit");
				}else{
					Util.popWindow("/fund/audited");
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
			applyType: this.state.detailInfo.applyType,
			currTask: currTask
		}
		Util.startLoading();
		this.state.disabled = true;
		this.setState(this.state);
		Ajax.post("/api/fund/transfer/audit",postData).then((res)=>{
			Util.sendNotification("reload");
			Util.success("操作成功", 1500, ()=>{
				Util.popWindow("/fund/audit");
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
		                    <p>申请时间</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.applyDate}</div>
		            </div>
		        </div>
	        	<div className="weui-cells__title">资金调拨信息</div>
	        	<div className="weui-cells m-t-n bg-white">
			        <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>申请金额</p>
		                </div>
		                <div className="weui-cell__ft">{Util.money(detailInfo.transferAmount)}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>目前剩余额度</p>
		                </div>
		                <div className="weui-cell__ft">{Util.money(detailInfo.residualAmount)}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>币种</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.currencyDesc}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>费用归属公司</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.companyName}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>申请类型</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.transferTypeDesc}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>期望到位日期</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.expectDueDate}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>预计还款日期</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.estReturnDate}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>贷款期限(月)</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.loanPeriod}</div>
		            </div>
		            <div className="weui-cell">
			            <If condition={ detailInfo.backgroundDesc && detailInfo.backgroundDesc.length > 15 }>
			            	<div className="weui-media-box_text">
			                    <h4 className="weui-media-box__title">背景说明</h4>
			                    <p className="weui-media-box__desc text-normal">{detailInfo.backgroundDesc}</p>
			                </div>
			            <Else />
			                <div className="weui-cell__bd">
			                    <p>报销说明</p>
			                </div>
			                <div className="weui-cell__ft">{detailInfo.backgroundDesc}</div>
			            </If>
		            </div>
		            <div className="weui-cell">
			            <If condition={ detailInfo.assessmentDesc && detailInfo.assessmentDesc.length > 15 }>
			            	<div className="weui-media-box_text">
			                    <h4 className="weui-media-box__title">使用计划/投资评估</h4>
			                    <p className="weui-media-box__desc text-normal">{detailInfo.assessmentDesc}</p>
			                </div>
			            <Else />
			                <div className="weui-cell__bd">
			                    <p>报销说明</p>
			                </div>
			                <div className="weui-cell__ft">{detailInfo.assessmentDesc}</div>
			            </If>
		            </div>	
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
