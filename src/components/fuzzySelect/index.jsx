import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Ajax from 'core/ajax'

export default class FuzzySelect extends Component {
	static init(){
		if(!this.node){
			this.node = document.createElement('div');
			document.getElementsByTagName('body')[0].appendChild(this.node);
		}
	}

	static open(options){
		this.init();
		ReactDOM.render(<FuzzySelect {...options} />, this.node);
	}

	static close(){
		ReactDOM.unmountComponentAtNode(this.node);
	}

	static defaultProps = {
		url: "",
		dataSource: [],
		callback : (data) => {},
		indexKey: ""
	}

	state = {
		alwaysList: [],
		list: []
	}
	
	constructor(props){
		super(props);
	}

	componentDidMount() {
		if(this.props.url){
			this.refs.serchInput.focus();
			this.search();
		}else if(this.props.dataSource.length){
			this.state.list = this.props.dataSource;
			this.setState(this.state);
		}
	}

	searchClear = () => {
		this.refs.serchInput.value = "";
		this.search();
	}

	search = () => {
		//ajax
		Ajax.get(this.props.url, {key: this.refs.serchInput.value}).then((res) => {
			this.state.alwaysList = res.data.commonList || [];
			this.state.list = res.data.indistinctList || [];
			this.setState(this.state);
		})
	}

	searchCancel = () => {
		FuzzySelect.close();
	}

	selected = (data) => {
		this.props.callback && this.props.callback(data);
		FuzzySelect.close();
	}

	render() {
		let indexKey = this.props.indexKey;
		let { hideResult, alwaysList, list } = this.state;
		return (
			<div className="fuzzySelect">
				<div className="weui-search-bar weui-search-bar_focusing">
		            <div className="weui-search-bar__form">
		                <div className="weui-search-bar__box">
		                    <i className="weui-icon-search"></i>
		                    <input type="search" className="weui-search-bar__input" placeholder="搜索" required onChange = { this.search } ref="serchInput"/>
		                    <a href="javascript:" className="weui-icon-clear" onClick = { this.searchClear }></a>
		                </div>
		                <label className="weui-search-bar__label">
		                    <i className="weui-icon-search"></i>
		                    <span>搜索</span>
		                </label>
		            </div>
		            <a href="javascript:" className="weui-search-bar__cancel-btn" onClick = { this.searchCancel }>取消</a>
		        </div>
		        <div className="weui-cells searchbar-result">
		        	<div className="weui-cells__title">常用</div>
		            <div className="always-tags flexbox flex-wrap">
		            	<If condition = { alwaysList.length }>
			            	<For each = "item" of = { alwaysList } index = "index">
			            		<a className="tag flex-1 text-center" href="javascript:;" key={index} onClick = {this.selected.bind(this, item)}>{item[indexKey]}</a>
			            	</For>
			            <Else/>
			            	<div className="text-center text-light flex-1">暂无数据~</div>
			            </If>
		            </div>
		            <div className="weui-cells__title">查询</div>
		            <div className="result-tags">
		            	<If condition = { list.length }>
			            	<For each = "item" of = { list } index = "index">
			            		<div className="weui-cell weui-cell_access" key={index} onClick = {this.selected.bind(this, item)}>
					                <div className="weui-cell__bd weui-cell_primary">
					                    <p>{item[indexKey]}</p>
					                </div>
					            </div>
			            	</For>
			            <Else/>
			            	<div className="text-center text-light">暂无数据~</div>
			            </If>
		            </div>
		        </div>
		    </div>
		)
	}
}
