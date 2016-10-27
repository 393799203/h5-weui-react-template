import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import Dispatcher from 'core/dispatcher';
import EventNames from 'data/eventNames';
import Util from 'core/util';
import Ajax from 'core/ajax';

export default class ListItem extends Component {
	static defaultProps = {
		ajaxUrl : "",
		params : {},
		rowKey: "",
		onChange: (list) => { }
	}

	state = {
		params: {},
		list: []
	}

	constructor(props){
		super(props);
	}

	getList = (currentIndex = 1) => {
		let params = Object.assign({}, this.state.params, { pageNum: currentIndex, pageSize: 10 });
		Util.startLoading();
		Ajax.post(this.props.ajaxUrl, params, 1).then(data => {
			this.state.list = data.data.list || [];
			this.state.total = data.data.total;
			this.props.onChange(data.data.list);
			Util.closeLoading();
			this.setState(this.state);
		}, (err) => {
			Util.closeLoading();
			this.state.list = [];
			if(err == this.state.ajaxUrl)return;
			this.setState(this.state);
		});
	}

	componentDidMount() {
		this.state.params = this.props.params;
		this.getList();
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
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary" to={{pathname: `/expense/${item.id}` , query: { "updated": item.updated}}}>操作</Link>
			            </div>
			        </div>
	            </For>
	        </div>
		)
	}
}