import React, { Component } from 'react'
import { Link } from  'react-router'

export default class ListItem extends Component {
	state = {
		dataSource: []
	}

	constructor(props){
		super(props);
		this.state.dataSource = props.dataSource;
	}

	componentWillReceiveProps(nextProps) {
	    this.state.dataSource = nextProps.dataSource;
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