import React, { Component } from 'react'
import { Link } from  'react-router'
import Infinite from 'react-infinite';
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
		currentIndex: 1,
		loading: false,
		isEnd: false,
		list: []
	}

	constructor(props){
		super(props);
		this.state.params = props.params;
	}

	onInfiniteLoad = () => {
		if(this.state.isEnd)return;
		this.getList(this.state.currentIndex);
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
			item.viewerOperateItems.replace("20","21");
			this.setState(this.state);
		})
	}

	elementInfiniteLoad = () => {
		console.log(this.state.isEnd)
		return (
			<div className="tips">
				<If condition={ this.state.loading }>
					<div className="weui-loadmore">
			            <i className="weui-loading"></i>
			            <span className="weui-loadmore__tips">正在加载</span>
			        </div>
		        </If>
		        <If condition={ this.state.list.length && this.state.isEnd} >
			        <div className="weui-loadmore weui-loadmore_line weui-loadmore_dot">
			            <span className="weui-loadmore__tips bg-none"></span>
			        </div>
		        </If>
		        <If condition={ !this.state.list.length && this.state.isEnd} >
			        <div className="weui-loadmore weui-loadmore_line">
			            <span className="weui-loadmore__tips bg-none">暂无数据</span>
			        </div>
		        </If>
		    </div>
		)
	}

	getList = (currentIndex = 1) => {
		let params = Object.assign({}, this.state.params, { pageNum: currentIndex, pageSize: 10 });
		this.state.loading = true;
		this.setState(this.state);
		Ajax.post(this.props.ajaxUrl, params, 1).then(data => {
			this.state.list = this.state.list.concat(data.data.list || []);
			this.props.onChange(data.data.list);
			this.state.loading = false; 
			this.state.isEnd = data.data.isEnd;
			this.state.currentIndex ++;
			this.setState(this.state);
		}, (err) => {
			this.state.loading = false;
			if(err == this.state.ajaxUrl)return;
			this.setState(this.state);
		});
	}

	componentDidMount() {
		this.dispatchId = Dispatcher.register((action) => {
			if(action.actionType === EventNames.FLUSH_LIST){
				this.state.params = action.params || this.state.params;
				this.getList();
			}
			if(action.actionType === EventNames.RESET_LIST){
				this.setState(this.state);
			}
		});
	}

	componentWillUnmount(){
		Dispatcher.unregister(this.dispatchId);
	}

	render() {
		let className = this.props.className;
		let isEnd = this.state.isEnd;
		let loading = this.state.loading;
		let list = this.state.list;
		return (
			<div className={classnames("weui-cells", className)}>
				<Infinite 
					elementHeight = {210}
					containerHeight = {window.innerHeight - 55 }
					infiniteLoadBeginEdgeOffset={150} 
					onInfiniteLoad={this.onInfiniteLoad}
					loadingSpinnerDelegate={this.elementInfiniteLoad()}
                    isInfiniteLoading={ true }
					>
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
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary" onClick={this.claim.bind(this, item)}>认领</Link>
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
	            
	            </Infinite>
	        </div>
		)
	}
}