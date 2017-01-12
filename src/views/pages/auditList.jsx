import React, { Component } from 'react'
import { browserHistory, Link } from  'react-router'
import classnames from 'classnames';
import ListView from 'components/listView';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class auditList extends BaseComponent {
	state = {
		params: {
			"outlineType": 3
		},
		ajaxUrl: "/api/trip/getMyOutlineList",
		isEnd: false,
		list: [],
		currentIndex: 1
	}

	constructor(props){
		super(props);
		Util.setTitle("报销审批");
		this.onRefresh();
	}

	getList = () => {
		let params = Object.assign({}, this.state.params, { pageNum: this.state.currentIndex, pageSize: 10 });
		return Ajax.post(this.state.ajaxUrl, params, 1).then(data => {
			this.state.list = this.state.list.concat(data.data.list || []);
			this.state.isEnd = data.data.isEnd;
			this.state.currentIndex ++;
			this.setState(this.state);
		}, err => {
			this.state.isEnd = true;
			this.setState(this.state);
		});
	}

	onRefresh = () => {
		this.state.list = [];
		this.state.currentIndex = 1;
		return this.getList(this.state.currentIndex);
	}

	onLoad = () => {
		return this.getList(this.state.currentIndex); 
	}

	componentDidMount() {
		document.addEventListener("reload", function(data){
			window.location.reload();
		}, false);
	}

	render() {
		let params = this.state.params;
		let ajaxUrl = this.state.ajaxUrl;
		let list = this.state.list;
		return (
			<ListView className="weui-cells" onRefresh={this.onRefresh} onLoad={ this.onLoad } isEnd={this.state.isEnd}>
				<For each = "item" of = { list } index = "index">
					<div className={ classnames("weui-form-preview", {"m-b-n": index == list.length - 1 })} key = {index}>
			            <div className="weui-form-preview__hd">
			                <div className="weui-form-preview__item">
			                    <label className="weui-form-preview__label">行程</label>
			                    <em className="weui-form-preview__value">{`${item.fromCity}-${item.toCities}`}</em>
			                </div>
			            </div>
			            <div className="weui-form-preview__bd">
			                <div className="weui-form-preview__item">
			                    <label className="weui-form-preview__label">申请人</label>
			                    <span className="weui-form-preview__value">{item.applyNickname}</span>
			                </div>
			                <div className="weui-form-preview__item">
			                    <label className="weui-form-preview__label">出行人</label>
			                    <span className="weui-form-preview__value">{item.passengers}</span>
			                </div>
			                <div className="weui-form-preview__item">
			                    <label className="weui-form-preview__label">时间</label>
			                    <span className="weui-form-preview__value">{item.departDateString}</span>
			                </div>
			            </div>
			            <div className="weui-form-preview__ft">
			            <If condition={item.viewerOperateItems.indexOf(21)!=-1}>
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary pushWindow" to={{pathname: `/expense/audit/${item.id}` , query: { "updated": item.updated}}}>审核</Link>
			            </If>
			            </div>
			        </div>
	            </For>
			</ListView>
		)
	}
}