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
		callback : (data) => {}
	}

	state = {
		hideResult: true
	}
	
	constructor(props){
		super(props);
	}

	componentDidMount() {
		this.refs.serchInput.focus();
	}

	searchClear = () => {
		this.refs.serchInput.value = "";
		this.state.hideResult = true;
		this.setState(this.state);
	}

	search = () => {
		this.state.hideResult = !this.refs.serchInput.value.length ? true : false
		//ajax
		Ajax.post(this.props.url, {key: this.refs.serchInput.value}).then((res) => {

		})
		this.setState(this.state);
	}

	searchCancel = () => {
		FuzzySelect.close();
	}

	selected = (data) => {
		this.props.callback && this.props.callback(data);
		FuzzySelect.close();
	}

	render() {
		let { hideResult } = this.state;
		return (
			<div className="fuzzySelect">
				<div className="weui-search-bar weui-search-bar_focusing">
		            <form className="weui-search-bar__form">
		                <div className="weui-search-bar__box">
		                    <i className="weui-icon-search"></i>
		                    <input type="search" className="weui-search-bar__input" placeholder="搜索" required onChange = { this.search } ref="serchInput"/>
		                    <a href="javascript:" className="weui-icon-clear" onClick = { this.searchClear }></a>
		                </div>
		                <label className="weui-search-bar__label">
		                    <i className="weui-icon-search"></i>
		                    <span>搜索</span>
		                </label>
		            </form>
		            <a href="javascript:" className="weui-search-bar__cancel-btn" onClick = { this.searchCancel }>取消</a>
		        </div>
		        <div className={classnames("weui-cells searchbar-result", {"hide" : hideResult})}>
		        	<div className="weui-cell weui-cell_access">
		                <div className="weui-cell__bd weui-cell_primary">
		                    <p>常用</p>
		                </div>
		            </div>
		            <div className="always-tags"></div>
		            <div className="weui-cell weui-cell_access">
		                <div className="weui-cell__bd weui-cell_primary">
		                    <p>结果</p>
		                </div>
		            </div>
		            <div className="result-tags"></div>
		        </div>
		    </div>
		)
	}
}
