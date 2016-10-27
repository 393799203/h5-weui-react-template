import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import Dispatcher from 'core/dispatcher';
import EventNames from 'data/eventNames';
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class ListItem extends Component {
	static defaultProps = {
		ajaxUrl : "",
		params : {},
		rowKey: "",
		onChange: (list) => { }
	}

	state = {
		params: {},
		loading: false,
		isEnd: false,
		list: []
	}

	constructor(props){
		super(props);
	}

	addEvents = () => {
		this.dispatchId = Dispatcher.register((action) => {
			if(action.actionType === EventNames.FLUSH_LIST){
				this.state.params = action.params || this.state.params;
				this.getList();
			}
			if(action.actionType === EventNames.RESET_LIST){
				this.setState(this.state);
			}
		});
		window.addEventListener("scroll", this.scrollHandler);
	}

	scrollHandler = (e) => {
		console.log(e);
	}

	getList = (currentIndex = 1) => {
		let params = Object.assign({}, this.state.params, { pageNum: currentIndex, pageSize: 10 });
		this.state.loading = true;
		this.setState(this.state);
		Ajax.post(this.props.ajaxUrl, params, 1).then(data => {
			this.state.list = data.data.list || [];
			this.props.onChange(data.data.list);
			this.state.loading = false;
			this.state.isEnd = data.data.isEnd;
			this.setState(this.state);
		}, (err) => {
			this.state.loading = false;
			this.state.isEnd = true;
			this.state.list = [];
			if(err == this.state.ajaxUrl)return;
			this.setState(this.state);
		});
	}

	componentDidMount() {
		this.state.params = this.props.params;
		this.addEvents();
		this.getList();
	}

	componentWillUnmount(){
		Dispatcher.unregister(this.dispatchId);
		window.removeEventListener('scroll', this.scrollHandler);
	}

	render() {
		let className = this.props.className;
		let isEnd = this.state.isEnd;
		let loading = this.state.loading;
		let list = this.state.list;
		return (
			<div className={classnames("weui-cells", className)}>
				<For each = "item" of = { list } index = "index">
					<div className="weui-form-preview" key = {index}>
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
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary" >认领</Link>
			            </If>
			            <If condition={item.viewerOperateItems.indexOf(21)!=-1}>
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary" to={{pathname: `/expense/audit/${item.id}` , query: { "updated": item.updated}}}>审核</Link>
			            </If>
			            <If condition={item.viewerOperateItems.indexOf(10)!=-1}>
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary" to={{pathname: `/expense/detail/${item.id}` , query: { "updated": item.updated}}}>查看</Link>
			            </If>
			            </div>
			        </div>
	            </For>
	            <If condition={loading}>
		            <div className="weui-loadmore">
			            <i className="weui-loading"></i>
			            <span className="weui-loadmore__tips">正在加载</span>
			        </div>
		        </If>
		        <If condition={ list.length && isEnd} >
			        <div className="weui-loadmore weui-loadmore_line weui-loadmore_dot">
			            <span className="weui-loadmore__tips bg-none"></span>
			        </div>
		        </If>
		        <If condition={!list.length && isEnd} >
			        <div className="weui-loadmore weui-loadmore_line">
			            <span className="weui-loadmore__tips bg-none">暂无数据</span>
			        </div>
		        </If>
	        </div>
		)
	}
}