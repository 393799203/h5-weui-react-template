import React, { Component } from 'react'
import classnames from 'classnames';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class ExpenseDetail extends BaseComponent {
	
	state = {
		detailInfo: {
			detailFormList: [],
			trifficForms: [],
			tripHotelList: [],
			teamBuildFormList: [],
			entertainFormList:[]
		},
		showAudit: false,
		disabled: false
	}

	constructor(props){
		super(props);
		Util.setTitle("差旅详情");
	}

	componentDidMount() {
	 	Util.startLoading();
		Ajax.get("/api/trip/detail", {id: this.props.params.id}).then((res)=>{
			this.state.detailInfo = res.data;
			if(this.props.route.path.indexOf('audit') != -1){
				this.state.showAudit = true;
			}
			this.setState(this.state);
			Util.closeLoading();
		}, (err) => {
			setTimeout(()=>{
				if(this.props.route.path.indexOf('audit') != -1){
					Util.popWindow("/audit");
				}else{
					Util.popWindow("/audited");
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
			applyWorkId: this.state.detailInfo.applyWorkId,
			type: this.state.detailInfo.type,
			currTask: currTask
		}
		Util.startLoading();
		this.state.disabled = true;
		this.setState(this.state);
		Ajax.post("/api/expense/request/audit",postData).then((res)=>{
			Util.sendNotification("reload");
			Util.success("操作成功", 1500, ()=>{
				Util.popWindow("/expense/audit");
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
			<div className="detail">
				<div className="weui-cells__title">基本信息</div>
				<div className="weui-cells m-t-n bg-white">
					<div className="weui-cell bg-white">
		                <div className="weui-cell__bd">
		                    <div className="pull-left">申请人</div>
		                    <div className="pull-right m-r-sm text-light">{ detailInfo.applyNickname }</div>
		                </div>
		                <div className="weui-cell__bd">
		                    <div className="pull-left m-l-sm">时间</div>
		                    <div className="pull-right text-light">{ detailInfo.applyDateString }</div>
		                </div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>部门</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.departName}</div>
		            </div>
		            <div className="weui-cell">
		                <div className="weui-cell__bd">
		                    <p>出行人</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.passengers}</div>
		            </div>
		            <div className="weui-cell">
			            <If condition={ detailInfo.reason && detailInfo.reason.length > 15 }>
			            	<div className="weui-media-box_text">
			                    <h4 className="weui-media-box__title">出行事由</h4>
			                    <p className="weui-media-box__desc text-normal">{detailInfo.reason}</p>
			                </div>
			            <Else />
			                <div className="weui-cell__bd">
			                    <p>出行事由</p>
			                </div>
			                <div className="weui-cell__ft">{detailInfo.reason}</div>
			            </If>
		            </div>
		        </div>
		        <If condition = { detailInfo.trifficForms && detailInfo.trifficForms.length }>
		        	<div className="weui-cells__title">差旅明细信息</div>
		        	<div className="weui-cells m-t-n">
			        	<For each = "item" of = { detailInfo.trifficForms } index = "index">
				        	<div className={classnames("bg-white", {"m-b": index != detailInfo.trifficForms.length -1})} key={ index }>
				        		<div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <div className="pull-left">时间</div>
					                    <div className="pull-right m-r-sm text-light">{item.actionDate}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left m-l-sm">费用类型</div>
					                    <div className="pull-right text-light">{item.expenseTypeName}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					            	<div className="weui-cell__bd">
					                    <div className="pull-left">交通工具</div>
					                    <div className="pull-right m-r-sm text-light">{item.typeName}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left m-l-sm">金额</div>
					                    <div className="pull-right text-light">{Util.money(item.amt)}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>行程</p>
					                </div>
					                <div className="weui-cell__ft">{item.departurePlace}-{item.destination}</div>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ item.comments && item.comments.length > 15 }>
						            	<div className="weui-media-box_text">
						                    <h4 className="weui-media-box__title">出行事由</h4>
						                    <p className="weui-media-box__desc text-normal">{item.comments}</p>
						                </div>
						            <Else />
						                <div className="weui-cell__bd">
						                    <p>出行事由</p>
						                </div>
						                <div className="weui-cell__ft">{item.comments}</div>
						            </If>
					            </div>
				        	</div>
			            </For>
			        </div>
		        </If>
		        <If condition = { detailInfo.entertainFormList && detailInfo.entertainFormList.length }>
		        	<div className="weui-cells__title">招待费明细信息</div>
		        	<div className="weui-cells m-t-n">
			        	<For each = "item" of = { detailInfo.entertainFormList } index = "index">
				        	<div className={classnames("bg-white",{ "m-b": index != detailInfo.entertainFormList.length -1 })} key={ index }>
				        		<div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <div className="pull-left">时间</div>
					                    <div className="pull-right m-r-sm text-light">{item.actionDate}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left m-l-sm">招待类型</div>
					                    <div className="pull-right text-light">{item.typeName}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					            	<div className="weui-cell__bd">
					                    <div className="pull-left">客户信息</div>
					                    <div className="pull-right m-r-sm text-light">{item.cusInfo}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left m-l-sm">金额</div>
					                    <div className="pull-right text-light">{Util.money(item.amt)}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					            	<div className="weui-cell__bd">
					                    <div className="pull-left">陪同人数</div>
					                    <div className="pull-right m-r-sm text-light">{item.num}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left m-l-sm">地点</div>
					                    <div className="pull-right text-light">{item.location}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>费用类型</p>
					                </div>
					                <div className="weui-cell__ft">{item.expenseTypeName}</div>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ item.comments && item.comments.length > 15 }>
						            	<div className="weui-media-box_text">
						                    <h4 className="weui-media-box__title">说明</h4>
						                    <p className="weui-media-box__desc text-normal">{item.comments}</p>
						                </div>
						            <Else />
						                <div className="weui-cell__bd">
						                    <p>说明</p>
						                </div>
						                <div className="weui-cell__ft">{item.comments}</div>
						            </If>
					            </div>
				        	</div>
			            </For>
			        </div>
		        </If>
		        <If condition = { detailInfo.teamBuildFormList && detailInfo.teamBuildFormList.length }>
		        	<div className="weui-cells__title">团建费明细信息</div>
		        	<div className="weui-cells m-t-n">
			        	<For each = "item" of = { detailInfo.teamBuildFormList } index = "index">
				        	<div className={classnames("bg-white",{ "m-b" : index != detailInfo.teamBuildFormList.length -1 })} key={ index }>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>时间</p>
					                </div>
					                <div className="weui-cell__ft">{item.actionDate}</div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>部门</p>
					                </div>
					                <div className="weui-cell__ft">{item.deptName}</div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>含子部门</p>
					                </div>
					                <div className="weui-cell__ft">{item.isSubDeptString}</div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>金额</p>
					                </div>
					                <div className="weui-cell__ft">{Util.money(item.amt)}</div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>费用类型</p>
					                </div>
					                <div className="weui-cell__ft">{item.expenseTypeName}</div>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ item.comments && item.comments.length > 15 }>
						            	<div className="weui-media-box_text">
						                    <h4 className="weui-media-box__title">说明</h4>
						                    <p className="weui-media-box__desc text-normal">{item.comments}</p>
						                </div>
						            <Else />
						                <div className="weui-cell__bd">
						                    <p>说明</p>
						                </div>
						                <div className="weui-cell__ft">{item.comments}</div>
						            </If>
					            </div>
				        	</div>
			            </For>
			        </div>
		        </If>
		        <If condition = { detailInfo.mealsFormList && detailInfo.mealsFormList.length } >
		        	<div className="weui-cells__title">餐饮费明细信息</div>
		        	<div className="weui-cells m-t-n">
			        	<For each = "item" of = { detailInfo.mealsFormList } index = "index">
				        	<div className={classnames("bg-white",{ "m-b" : index != detailInfo.mealsFormList.length -1 })} key={ index }>
				        		<div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <div className="pull-left">时间</div>
					                    <div className="pull-right m-r-sm text-light">{item.actionDate}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left m-l-sm">地点</div>
					                    <div className="pull-right text-light">{item.location}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <div className="pull-left">金额</div>
					                    <div className="pull-right text-light">{Util.money(item.amt)}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>费用类型</p>
					                </div>
					                <div className="weui-cell__ft">{item.expenseTypeName}</div>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ item.comments && item.comments.length > 15 }>
						            	<div className="weui-media-box_text">
						                    <h4 className="weui-media-box__title">与餐人员</h4>
						                    <p className="weui-media-box__desc text-normal">{item.content}</p>
						                </div>
						            <Else />
						                <div className="weui-cell__bd">
						                    <p>与餐人员</p>
						                </div>
						                <div className="weui-cell__ft">{item.content}</div>
						            </If>
					            </div>
				        	</div>
			            </For>
			        </div>
		        </If>
		        <If condition = { detailInfo.tripHotelList && detailInfo.tripHotelList.length } >
		        	<div className="weui-cells__title">住宿费明细信息</div>
		        	<div className="weui-cells m-t-n">
			        	<For each = "item" of = { detailInfo.tripHotelList } index = "index">
				        	<div className={classnames("bg-white",{ "m-b" :index != detailInfo.tripHotelList.length -1 })} key={ index }>
				        		<div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <div className="pull-left">入住日期</div>
					                    <div className="pull-right m-r-sm text-light">{item.checkInDate}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left m-l-sm">离开日期</div>
					                    <div className="pull-right text-light">{item.checkoutDate}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					            	<div className="weui-cell__bd">
					                    <div className="pull-left">酒店</div>
					                    <div className="pull-right m-r-sm text-light">{item.typeName}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left m-l-sm">金额</div>
					                    <div className="pull-right text-light">{Util.money(item.amt)}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>费用类型</p>
					                </div>
					                <div className="weui-cell__ft">{item.expenseTypeName}</div>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ item.comments && item.comments.length > 15 }>
						            	<div className="weui-media-box_text">
						                    <h4 className="weui-media-box__title">说明</h4>
						                    <p className="weui-media-box__desc text-normal">{item.comments}</p>
						                </div>
						            <Else />
						                <div className="weui-cell__bd">
						                    <p>说明</p>
						                </div>
						                <div className="weui-cell__ft">{item.comments}</div>
						            </If>
					            </div>
				        	</div>
			            </For>
			        </div>
		        </If>
		        <If condition = { detailInfo.detailFormList && detailInfo.detailFormList.length } >
			        <div className="weui-cells__title">其他明细信息</div>
			        <div className="weui-cells m-t-n">
			        	<For each = "item" of = { detailInfo.detailFormList } index = "index">
				        	<div className={classnames("bg-white",{ "m-b" : index != detailInfo.detailFormList.length -1 })} key={ index }>
				        		<div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>时间</p>
					                </div>
					                <div className="weui-cell__ft">{item.actionDate}</div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>费用类型</p>
					                </div>
					                <div className="weui-cell__ft">{item.expenseTypeName}</div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>金额</p>
					                </div>
					                <div className="weui-cell__ft">{Util.money(item.amt)}</div>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ item.comments && item.comments.length > 15 }>
						            	<div className="weui-media-box_text">
						                    <h4 className="weui-media-box__title">说明</h4>
						                    <p className="weui-media-box__desc text-normal">{item.comments}</p>
						                </div>
						            <Else />
						                <div className="weui-cell__bd">
						                    <p>明细说明</p>
						                </div>
						                <div className="weui-cell__ft">{item.comments}</div>
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
