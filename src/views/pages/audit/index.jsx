import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import ListView from 'components/listView';
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class auditList extends Component {
	state = {
		params: {
			"outlineType": 3
		},
		ajaxUrl: "/expense/request/getMyOutlineList",
		isEnd: false,
		list: [],
		currentIndex: 1
	}

	constructor(props){
		super(props);
		Util.setTitle("报销审批-待审批");
		this.onRefresh();
	}

	claim = (item) => {
		let postData = {
			applyId: item.id, 
			taskId: item.currTask.taskId,
			taskUpdated: item.currTask.updated,
			updated: item.updated
		}
		Ajax.post("/expense/request/claim", postData).then((res) => {
			item.updated = res.data.updated;
			item.viewerOperateItems = item.viewerOperateItems.replace("20", "21");
			this.setState(this.state);
		})
	}

	getList = () => {
		let params = Object.assign({}, this.state.params, { pageNum: this.state.currentIndex, pageSize: 10 });
		return Ajax.post(this.state.ajaxUrl, params, 1).then(data => {
			this.state.list = this.state.list.concat(data.data.list || []);
			this.state.isEnd = data.data.isEnd;
			this.state.currentIndex ++;
			this.setState(this.state);
		}, err => {
			Util.error(err);
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
			                    <label className="weui-form-preview__label">报销金额</label>
			                    <em className="weui-form-preview__value">¥{Util.money(item.amt)}</em>
			                </div>
			            </div>
			            <div className="weui-form-preview__bd">
			                <div className="weui-form-preview__item">
			                    <label className="weui-form-preview__label">申请人</label>
			                    <span className="weui-form-preview__value">{!item.agentNickName? item.applyNickName: `${item.applyNickName}(${item.agentNickName}代申请)`}</span>
			                </div>
			                <div className="weui-form-preview__item">
			                    <label className="weui-form-preview__label">类型</label>
			                    <span className="weui-form-preview__value">{item.typeName}</span>
			                </div>
			            </div>
			            <div className="weui-form-preview__ft">
			            <If condition={item.viewerOperateItems.indexOf(20)!=-1}>
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary" onClick={this.claim.bind(this, item)}>认领</Link>
			            </If>
			            <If condition={item.viewerOperateItems.indexOf(21)!=-1}>
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary pushWindow" to={{pathname: `/expense/audit/${item.id}` , query: { "updated": item.updated}}}>审核</Link>
			            </If>
			            <If condition={item.viewerOperateItems.indexOf(10)!=-1}>
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary pushWindow" to={{pathname: `/expense/detail/${item.id}` , query: { "updated": item.updated}}}>查看</Link>
			            </If>
			            </div>
			        </div>
	            </For>
			</ListView>
		)
	}
}