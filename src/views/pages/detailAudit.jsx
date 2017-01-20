import React, { Component } from 'react'
import classnames from 'classnames';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class DetailAudit extends BaseComponent {
	
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
			this.state.detailInfo.applyItems.forEach((item) => {
				item.checked = true;
			})
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

	selected = (item, ev) => {
		item.checked = ev.target.checked;
		this.setState(this.state);
	}

	audit = () => {
		let taskIdAndActionsArr = [];
		let failArr = [];
		this.state.detailInfo.applyItems.forEach((item, index) => {
			if(item.checked){
				taskIdAndActionsArr.push(item.taskId+'_pass');
			}else{
				taskIdAndActionsArr.push(item.taskId+'_fail');
				failArr.push(item.passengerNickname);
			}
		});
		let postData = {
			id: this.state.detailInfo.applyId,
			taskIdAndActions: taskIdAndActionsArr.join(','),
			comment: this.refs.auditTextarea.value
		}

		if(failArr.length && !this.refs.auditTextarea.value){
			Util.error("有人不通过需要填写驳回意见~", 1500);
			return;
		}
		Util.startLoading();
		this.state.disabled = true;
		this.setState(this.state);
		Ajax.post("/api/trip/audit",postData).then((res)=>{
			Util.sendNotification("reload");
			Util.success("操作成功", 1500, ()=>{
				Util.popWindow("/audit");
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
		            	<If condition={ detailInfo.passengers && detailInfo.passengers.length > 15 }>
			                <div className="weui-media-box_text">
			                    <h4 className="weui-media-box__title">出行人</h4>
			                    <p className="weui-media-box__desc text-normal">{detailInfo.passengers}</p>
			                </div>
			            <Else />
			            	<div className="weui-cell__bd">
			                    <p>出行人</p>
			                </div>
			                <div className="weui-cell__ft">{detailInfo.passengers}</div>
			            </If>
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
		        <If condition = { detailInfo.trips && detailInfo.trips.length }>
		        	<div className="weui-cells__title">行程详情</div>
		        	<div className="weui-cells m-t-n">
			        	<For each = "item" of = { detailInfo.trips } index = "index">
				        	<div className={classnames("bg-white", {"m-b": index != detailInfo.trips.length -1})} key={ index }>
				        		<div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <div className="pull-left">时间</div>
					                    <div className="pull-right m-r-sm text-light">{item.departDateString}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left m-l-sm">交通类型</div>
					                    <div className="pull-right text-light">{item.trafficTypeName}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>行程</p>
					                </div>
					                <div className="weui-cell__ft">{`${item.fromCity}-${item.toCity}`}</div>
					            </div>
				        	</div>
			            </For>
			        </div>
		        </If>
		        <If condition = { detailInfo.hotels && detailInfo.hotels.length } >
		        	<div className="weui-cells__title">住宿详情</div>
		        	<div className="weui-cells m-t-n">
			        	<For each = "item" of = { detailInfo.hotels } index = "index">
				        	<div className={classnames("bg-white",{ "m-b" :index != detailInfo.hotels.length -1 })} key={ index }>
				        		<div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <div className="pull-left">入住日期</div>
					                    <div className="pull-right m-r-sm text-light">{item.checkInDateString}</div>
					                </div>
					                <div className="weui-cell__bd">
					                    <div className="pull-left m-l-sm">退房日期</div>
					                    <div className="pull-right text-light">{item.checkoutDateString}</div>
					                </div>
					            </div>
					            <div className="weui-cell">
					                <div className="weui-cell__bd">
					                    <p>入住城市</p>
					                </div>
					                <div className="weui-cell__ft">{item.city}</div>
					            </div>
					            <div className="weui-cell">
					            	<If condition={ item.passengers && item.passengers.length > 15 }>
					            		<div className="weui-media-box_text">
						                    <h4 className="weui-media-box__title">入住人员</h4>
						                    <p className="weui-media-box__desc text-normal">{item.passengers}</p>
						                </div>
					            	<Else />
						                <div className="weui-cell__bd">
						                    <p>入住人员</p>
						                </div>
						                <div className="weui-cell__ft">{item.passengers}</div>
					                </If>
					            </div>
				        	</div>
			            </For>
			        </div>
		        </If>
		        <If condition = {showAudit}>
		        	<div className="weui-cells__title">出行人审批</div>
		        	<For each = "item" of = { detailInfo.applyItems } index = "index">
			        	<div className="weui-cells weui-cells_checkbox bg-white" key={index}>
				            <label className="weui-cell weui-check__label" htmlFor = {`checkbox${index}`}>
				                <div className="weui-cell__hd">
				                    <input type="checkbox" className="weui-check" name="checkbox" id={`checkbox${index}`} onChange={this.selected.bind(this, item)} checked={item.checked? "checked":""}/>
				                    <i className="weui-icon-checked"></i>
				                </div>
				                <div className="weui-cell__bd">
				                	<span className="usernick">{`${item.passengerNickname}(${item.realname}) - ${item.cardId} - ${item.mobile}`}</span>
				                </div>
				            </label>
			            </div>
			        </For>
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
				        		<a href="javascript:;" className={classnames("weui-btn", "weui-btn_primary", "m-xs", {"weui-btn_disabled": disabled})} onClick={this.audit}>确定</a>
				        	</div>
				        </div>
			        </div>
		        </If>
			</div>
		)
	}
}
