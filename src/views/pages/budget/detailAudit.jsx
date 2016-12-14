import React, { Component } from 'react'
import classnames from 'classnames';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class ExpenseDetail extends BaseComponent {
	
	state = {
		currentYear: parseInt(moment().format('YYYY')),
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
		let postData = Object.assign({}, this.state.detailInfo, {currTask: currTask});
		Util.startLoading();
		this.state.disabled = true;
		this.setState(this.state);
		Ajax.post("/api/budget/budgetrequest/audit",postData).then((res)=>{
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
		let currentYear = this.state.currentYear;
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
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>申请类型</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.isChangedDesc}</div>
		            </div>
		        </div>
		        <If condition= { !detailInfo.isChanged } >
		        	<div className="weui-cells__title">预算编制信息</div>
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
					                    <div className="pull-right text-light">￥{Util.money(item.q1Sum + item.q2Sum + item.q3Sum + item.q4Sum)}</div>
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
					            <div className="weui-cell">
					            	<If condition={ item.comments && item.comments.length > 15 }>
						            	<div className="weui-media-box_text">
						                    <h4 className="weui-media-box__title">备注</h4>
						                    <p className="weui-media-box__desc text-normal">{item.remark}</p>
						                </div>
						            <Else />
						                <div className="weui-cell__bd">
						                    <p>备注</p>
						                </div>
						                <div className="weui-cell__ft">{item.remark}</div>
						            </If>
					            </div>
				        	</div>
			            </For>
			        </div>
		        <Else />
		        	<div className="weui-cells__title">预算调整信息</div>
		        	<div className="weui-cells m-t-n">
			        	<For each = "item" of = { detailInfo.budgetRequestItemShipDtoList || [] } index = "index">
				        	<div className={classnames("bg-white", {"m-b": index != detailInfo.budgetRequestItemShipDtoList.length -1})} key={ index }>
				        		<div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <div className="pull-left">预算类目</div>
					                    <div className="pull-right text-light">{item.budgetCategoryName}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ detailInfo.budgetYear > currentYear ||(detailInfo.budgetYear == currentYear && moment().quarter() <= 1) }>
						            	<div className="weui-cell__bd">
						                    <div className="pull-left">Q1调整前</div>
						                    <div className="pull-right m-r-sm text-light">￥{Util.money(item.q1Sum)}</div>
						                </div>
						                <div className="weui-cell__bd">
						                    <div className="pull-left m-l-sm">调整后</div>
						                    <div className="pull-right text-light">￥{Util.money(item.changedQ1Sum)}</div>
						                </div>
						            <Else />
						            	<div className="weui-cell__bd">
						                    <div className="pull-left">Q1实际值</div>
						                    <div className="pull-right text-light">￥{Util.money(item.actualQ1Sum)}</div>
						                </div>
						            </If>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ detailInfo.budgetYear > currentYear || ( detailInfo.budgetYear == currentYear && moment().quarter() <= 2) }>
						            	<div className="weui-cell__bd">
						                    <div className="pull-left">Q2调整前</div>
						                    <div className="pull-right m-r-sm text-light">￥{Util.money(item.q2Sum)}</div>
						                </div>
						                <div className="weui-cell__bd">
						                    <div className="pull-left m-l-sm">调整后</div>
						                    <div className="pull-right text-light">￥{Util.money(item.changedQ2Sum)}</div>
						                </div>
					                <Else />
						            	<div className="weui-cell__bd">
						                    <div className="pull-left">Q2实际值</div>
						                    <div className="pull-right text-light">￥{Util.money(item.actualQ2Sum)}</div>
						                </div>
						            </If>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ detailInfo.budgetYear > currentYear || ( detailInfo.budgetYear == currentYear && moment().quarter() <= 3) }>
						            	<div className="weui-cell__bd">
						                    <div className="pull-left">Q3调整前</div>
						                    <div className="pull-right m-r-sm text-light">￥{Util.money(item.q3Sum)}</div>
						                </div>
						                <div className="weui-cell__bd">
						                    <div className="pull-left m-l-sm">调整后</div>
						                    <div className="pull-right text-light">￥{Util.money(item.changedQ3Sum)}</div>
						                </div>
						            <Else />
						            	<div className="weui-cell__bd">
						                    <div className="pull-left">Q3实际值</div>
						                    <div className="pull-right text-light">￥{Util.money(item.actualQ3Sum)}</div>
						                </div>
						            </If>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ detailInfo.budgetYear > currentYear || ( detailInfo.budgetYear == currentYear && moment().quarter() <= 4) }>
						            	<div className="weui-cell__bd">
						                    <div className="pull-left">Q4调整前</div>
						                    <div className="pull-right m-r-sm text-light">￥{Util.money(item.q4Sum)}</div>
						                </div>
						                <div className="weui-cell__bd">
						                    <div className="pull-left m-l-sm">调整后</div>
						                    <div className="pull-right text-light">￥{Util.money(item.changedQ4Sum)}</div>
						                </div>
						            <Else />
						            	<div className="weui-cell__bd">
						                    <div className="pull-left">Q4实际值</div>
						                    <div className="pull-right text-light">￥{Util.money(item.actualQ4Sum)}</div>
						                </div>
						            </If>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ item.comments && item.comments.length > 15 }>
						            	<div className="weui-media-box_text">
						                    <h4 className="weui-media-box__title">备注</h4>
						                    <p className="weui-media-box__desc text-normal">{item.remark}</p>
						                </div>
						            <Else />
						                <div className="weui-cell__bd">
						                    <p>备注</p>
						                </div>
						                <div className="weui-cell__ft">{item.remark}</div>
						            </If>
					            </div>
				        	</div>
			            </For>
			        </div>
		        </If>
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
