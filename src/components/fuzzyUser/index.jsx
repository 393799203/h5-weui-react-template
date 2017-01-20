import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Ajax from 'core/ajax'

export default class FuzzyUser extends Component {
	static init(){
		if(!this.node){
			this.node = document.createElement('div');
			document.getElementsByTagName('body')[0].appendChild(this.node);
		}
	}

	static open(options){
		this.init();
		ReactDOM.render(<FuzzyUser {...options} />, this.node);
	}

	static close(){
		ReactDOM.unmountComponentAtNode(this.node);
	}

	static defaultProps = {
		selectedIds: [],
		dataSource: [],
		callback : (data) => {}
	}

	state = {
		disableSerach: false,
		list: [],
		batchSelectedList: []
	}
	
	constructor(props){
		super(props);
	}

	componentDidMount() {
		if(this.props.dataSource.length){
			this.state.disableSerach = true;
			this.state.list = this.props.dataSource.map((user, index)=>{
				let cpUser = Object.assign({}, user);
				for(var i = 0; i < this.props.selectedIds.length; i++){
					if(cpUser.userId == this.props.selectedIds[i]){
						this.state.batchSelectedList.push(cpUser);
						cpUser.checked = true;
					}
				}
				return cpUser
			});
			this.setState(this.state);
		}else{
			this.refs.serchInput.focus();
			this.search();
		}
	}

	searchClear = () => {
		this.refs.serchInput.value = "";
		this.search();
	}

	search = () => {
		Ajax.get('/api/user/fuzzySearchUsers', {key: this.refs.serchInput.value}).then((res) => {
			this.state.list = res.data.list || [];
			this.setState(this.state);
		})
	}

	searchCancel = () => {
		FuzzyUser.close();
	}

	selected = (data, ev) => {
		if(ev.target.checked){
			this.state.batchSelectedList.push(data);
		}else{
			let index = -1;
			for (var i = 0 ; i < this.state.batchSelectedList.length ; i++){
				if(this.state.batchSelectedList[i].userId == data.userId){
					index = i
				}
			}
			if(index!=-1){
				this.state.batchSelectedList.splice(index, 1);
			}
		}
		data.checked = ev.target.checked;
		this.setState(this.state);
	}

	selectAll = () => {
		this.state.batchSelectedList = [];
		this.state.list.map((item, index) => {
			item.checked = true;
			this.state.batchSelectedList.push(item);
		});
		this.setState(this.state);
	}

	unSelectAll = () => {
		this.state.batchSelectedList = [];
		this.state.list.map((item, index) => {
			item.checked = false;
		});
		this.setState(this.state);
	}

	selectedBatch = () => {
		let data = this.state.batchSelectedList;
		this.props.callback && this.props.callback(data);
		FuzzyUser.close();
	}

	render() {
		let { disableSerach, list, batchSelectedList } = this.state;
		return (
			<div className="fuzzySelect">
				<If condition={!disableSerach} >
				<div className="weui-search-bar weui-search-bar_focusing">
		            <div className="weui-search-bar__form">
		                <div className="weui-search-bar__box">
		                    <i className="weui-icon-search"></i>
		                    <input type="search" className="weui-search-bar__input" placeholder="搜索" required onChange = { this.search } ref="serchInput"/>
		                    <a href="javascript:" className="weui-icon-clear" onClick = { this.searchClear }></a>
		                </div>
		            </div>
		            <a href="javascript:" className="weui-search-bar__cancel-btn" onClick = { this.searchCancel }>取消</a>
		        </div>
		        </If>
		        <div className="weui-cells searchbar-result">
		            <div className="weui-cells__title clearfix">
		            	<If condition={disableSerach}>
		            		<a href="javascript:" className="pull-left text-primary" onClick = { this.searchCancel }>取消</a>
		            	<Else/>
		            		<span>查询</span>
		            	</If>
		            	<If condition={disableSerach && list.length != batchSelectedList.length}>
		            		<a className="pull-right text-primary" href="javascript:;" onClick={this.selectAll}>全选</a>
		            	</If>
		            	<If condition={disableSerach && list.length == batchSelectedList.length}>
		            		<a className="pull-right text-primary" href="javascript:;" onClick={this.unSelectAll}>全不选</a>
		            	</If>
	            	</div>
		            <div className="result-tags">
		            	<If condition = { list.length }>
			            	<For each = "item" of = { list } index = "index">
		            			<div className="weui-cells weui-cells_checkbox" key={index}>
						            <label className="weui-cell weui-check__label" htmlFor = {`checkbox${index}`}>
						                <div className="weui-cell__hd">
						                    <input type="checkbox" className="weui-check" name="checkbox" id={`checkbox${index}`} onChange={this.selected.bind(this, item)} checked={item.checked? "checked":""}/>
						                    <i className="weui-icon-checked"></i>
						                </div>
						                <div className="weui-cell__bd">
						                	<div className="avatar m-r-xs">
						                		<img src={item.avatar} />
						                	</div>
						                	<span className="usernick">{item.nickName}</span>
						                </div>
						            </label>
					            </div>
			            	</For>
			            <Else/>
			            	<div className="text-center text-light">暂无数据~</div>
			            </If>
		            </div>
		        </div>
		        <div className="weui-flex p-xs">
		        	<div className="weui-flex__item">
		        		<a href="javascript:;" className={classnames("weui-btn weui-btn_primary m-xs")} onClick={this.selectedBatch}>确定</a>
		        	</div>
		        </div>
		    </div>
		)
	}
}
