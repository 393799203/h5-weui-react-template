import React, { Component } from 'react'
import { browserHistory, Link } from  'react-router'
import classnames from 'classnames';
import ListView from 'components/listView';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class Application extends BaseComponent {
	state = {
		params: {
			"outlineType": 12
		},
		ajaxUrl: "/api/trip/getMyOutlineList",
		isEnd: false,
		list: [],
		currentIndex: 1
	}

	constructor(props){
		super(props);
		Util.setTitle("我的申请");
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

	cancel = (item, index) => {
		let postData = {
			id: item.applyId
		}
		Util.startLoading("撤销中");
		Ajax.post("/api/trip/cancel", postData).then((res) => {
			console.log(index);
			Util.success("操作成功", 1500, ()=>{
				this.state.list.splice(index, 1);
				this.setState(this.state);
			});
		}, (err) => {
		})
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
			                <div className="weui-form-preview__item">
			                    <label className="weui-form-preview__label">状态</label>
			                    <span className="weui-form-preview__value">{item.assigneeNickname?`${item.statusName}(${item.assigneeNickname})`: `${item.statusName}`}</span>
			                </div>
			            </div>
			            <div className="weui-form-preview__ft">
			            <If condition={item.viewerOperateItems.indexOf(10)!=-1}>
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary pushWindow" to={{pathname: `/detail/${item.applyId}`}}>查看</Link>
			            </If>
			            <If condition={item.viewerOperateItems.indexOf(90)!=-1}>
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary" onClick={this.cancel.bind(this, item, index)}>撤销</Link>
			            </If>
			            <If condition={item.viewerOperateItems.indexOf(100)!=-1}>
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary pushWindow" to={{pathname: `/gotoCtrip`, query: { "applyWorkId": item.applyWorkId}}}>机票预订</Link>
			            </If>
			            <If condition={item.viewerOperateItems.indexOf(101)!=-1}>
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary pushWindow" to={{pathname: `/gotoCtrip`, query: { "applyWorkId": item.applyWorkId}}}>酒店预定</Link>
			            </If>
			            </div>
			        </div>
	            </For>
			</ListView>
		)
	}
}