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
		console.log(this.props.selectedIds)
		if(this.props.dataSource.length){
			this.state.disableSerach = true;
			//设置默认
			this.state.list = this.props.dataSource.map((user, index)=>{
				for(var i = 0; i < this.props.selectedIds.length; i++){
					if(user.userId == this.props.selectedIds[i]){
						user.checked = true;
						this.state.batchSelectedList.push(user);
					}
				}
				return user
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

	selectedBatch = () => {
		let data = this.state.batchSelectedList;
		this.props.callback && this.props.callback(data);
		FuzzyUser.close();
	}

	render() {
		let { disableSerach, list, batchSelectedList } = this.state;
		return (
			<div className="fuzzySelect">
				<div className="weui-search-bar weui-search-bar_focusing">
		            <form className="weui-search-bar__form">
		                <div className="weui-search-bar__box">
		                    <i className="weui-icon-search"></i>
		                    <input type="search" className="weui-search-bar__input" placeholder="搜索" required onChange = { this.search } ref="serchInput" disabled={ disableSerach ? "disabled":""}/>
		                    <a href="javascript:" className="weui-icon-clear" onClick = { this.searchClear }></a>
		                </div>
		                <label className="weui-search-bar__label">
		                    <i className="weui-icon-search"></i>
		                    <span>搜索</span>
		                </label>
		            </form>
		            <a href="javascript:" className="weui-search-bar__cancel-btn" onClick = { this.searchCancel }>取消</a>
		        </div>
		        <div className="weui-cells searchbar-result">
		            <div className="weui-cells__title">查询</div>
		            <div className="result-tags">
		            	<If condition = { list.length }>
			            	<For each = "item" of = { list } index = "index">
		            			<div className="weui-cells weui-cells_checkbox" key={index}>
						            <label className="weui-cell weui-check__label" htmlFor = {`checkbox${index}`}>
						                <div className="weui-cell__hd">
						                    <input type="checkbox" className="weui-check" name="checkbox" id={`checkbox${index}`} onChange={this.selected.bind(this, item)} checked={item.checked? "checked":""}/>
						                    <i className="weui-icon-checked"></i>
						                </div>
						                <div className="weui-cell__bd">{item.nickName}</div>
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
