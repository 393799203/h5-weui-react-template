import React, { Component } from 'react'
import { Link } from  'react-router'
import Dispatcher from 'core/dispatcher';
import EventNames from 'data/eventNames';
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
		dataSource: []
	}

	constructor(props){
		super(props);
	}

	getList = (currentIndex = 1) => {
		let params = Object.assign({}, this.state.params, { pageNum: currentIndex, pageSize: 10 });
		this.state.loading = true;
		this.setState(this.state);
		Ajax.post(this.props.ajaxUrl, params, 1).then(data => {
			this.state.list = data.data.list || [];
			this.state.total = data.data.total;
			this.props.onChange(data.data.list);
			Util.closeLoading();
			this.setState(this.state);
		}, (err) => {
			this.state.loading = false;
			this.state.list = [];
			if(err == this.state.ajaxUrl)return;
			this.setState(this.state);
		});
	}

	componentDidMount() {
		this.state.params = this.props.params;
		Util.success();
		// this.getList();
	   	this.dispatchId = Dispatcher.register((action) => {
			if(action.actionType === EventNames.FLUSH_LIST){
				Util.startLoading();
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
		let dataSource = this.state.dataSource;
		return (
			<div className="weui-cells">
				<For each = "item" of = { dataSource } index = "index">
					<div className="weui-form-preview" key = {index}>
			            <div className="weui-form-preview__hd">
			                <div className="weui-form-preview__item">
			                    <label className="weui-form-preview__label">报销金额</label>
			                    <em className="weui-form-preview__value">¥{item.amt}</em>
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
			                <Link className="weui-form-preview__btn weui-form-preview__btn_primary" to={ item.link }>操作</Link>
			            </div>
			        </div>
	            </For>
	        </div>
		)
	}
}