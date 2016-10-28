import React, { Component } from 'react'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class ExpenseDetail extends Component {
	
	state = {
		detailInfo: {
			detailFormList: []
		}
	}

	constructor(props){
		super(props);
	}

	componentDidMount() {
	 	Util.startLoading();
		Ajax.get("/expense/request/detail", {id: this.props.params.id, updated: this.props.location.query.updated}).then((res)=>{
			this.state.detailInfo = res.data;
			this.setState(this.state);
			Util.closeLoading();
		}, (err) => {
			Util.closeLoading();
		});     
	}

	render() {
		let detailInfo = this.state.detailInfo;
		return (
			<div className="expense-detail o-h">
				<div className="weui-cells__title">基本信息</div>
				<div className="weui-cells m-t-n">
		            <div className="weui-cell bg-white">
		                <div className="weui-cell__bd">
		                    <p>申请人</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.applyNickName}</div>
		            </div>
		            <div className="weui-cell bg-white">
		                <div className="weui-cell__bd">
		                    <p>申请时间</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.applyDate}</div>
		            </div>
		            <div className="weui-cell bg-white">
		                <div className="weui-cell__bd">
		                    <p>费用归属部门</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.deptName}</div>
		            </div>
		            <div className="weui-cell bg-white">
		                <div className="weui-cell__bd">
		                    <p>费用归属公司</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.companyName}</div>
		            </div>
		            <div className="weui-cell bg-white">
		                <div className="weui-cell__bd">
		                    <p>发票张数</p>
		                </div>
		                <div className="weui-cell__ft">{detailInfo.invoiceCount}</div>
		            </div>
		            <div className="weui-cell bg-white">
		                <div className="weui-cell__bd">
		                    <p>总计金额</p>
		                </div>
		                <div className="weui-cell__ft">{Util.money(detailInfo.amt || 0)}</div>
		            </div>
		            <div className="weui-cell bg-white">
			            <If condition={ detailInfo.content && detailInfo.content.length > 10 }>
			            	<div className="weui-media-box_text">
			                    <h4 className="weui-media-box__title">报销说明</h4>
			                    <p className="weui-media-box__desc">{detailInfo.content}</p>
			                </div>
			            <Else />
			                <div className="weui-cell__bd">
			                    <p>报销说明</p>
			                </div>
			                <div className="weui-cell__ft">{detailInfo.content}</div>
			            </If>
		            </div>
		        </div>
		        <div className="weui-cells__title">其他明细信息</div>
		        <div className="weui-cells m-t-n">
		        	<For each = "item" of = { detailInfo.detailFormList } index = "index">
		        	<div className="bg-white m-b" key={ index }>
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
			            	<If condition={ item.comments && item.comments.length > 10 }>
				            	<div className="weui-media-box_text">
				                    <h4 className="weui-media-box__title">说明</h4>
				                    <p className="weui-media-box__desc">{item.comments}</p>
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
			</div>
		)
	}
}
