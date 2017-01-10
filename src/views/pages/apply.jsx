import React, { Component } from 'react';
import BaseComponent from 'core/baseComponent';
import classnames from 'classnames';
import Ajax from 'core/ajax';
import Util from 'core/util';
import Global from 'server/global';
import Icon from 'components/icon';

export default class TravelApply extends BaseComponent {
	state = {
		params: {
			nickName: "",
			deptName: "",//也要ID
			deptId: "",
			travellers: [],
			reason: "",
			march: [{
				from: "",
				to: "",
				time: moment().format('YYYY-MM-DD'),
				traffic: ""
			}],
			inn: [{
				beginTime: moment().format('YYYY-MM-DD'),
				endTime: moment().format('YYYY-MM-DD')
			}]
		},
		disabled: false,
		innCityList: []
	}

	constructor(props){
		super(props);
		Util.setTitle("差旅申请");
	}

	componentDidMount() {
		let getCurrentUserPromise = Global.getCurrentUser();
		Promise.all([getCurrentUserPromise]).then(res => {
			this.state.params.nickName = res[0].data.nickName;
			this.state.params.deptName = res[0].data.biz1thDeptName;
			this.state.params.travellers.push(this.simpleUser(res[0].data));
			this.setState(this.state);
		}, (err) => {
			setTimeout(()=>{
				Util.popWindow("/apply");
			}, 2000);
		})
	}

	addUser = () => {
		let userIds = this.state.params.travellers.map((item, index) => item.userId);
		Util.selectTTContact(userIds).then(res => {
			let selectedUser = res.map((item, index) => this.simpleUser(item));
			this.state.params.travellers = this.state.params.travellers.concat(selectedUser);
			this.setState(this.state);
		}, res => {
			Util.error(res)
		})
	}

	deleteUser = (index) => {
		this.state.params.travellers.splice(index, 1);
		this.setState(this.state);
	}

	simpleUser = (user) => {
		return {
			avatar: user.avatar || user.avatar_url,
			nickName: user.nickName || user.user_nick_name,
			userId: parseInt(user.userId || user.user_id)
		}
	}

	addMarch = () => {
		this.state.params.march.push({
			from: "",
			to: "",
			time: moment().format('YYYY-MM-DD'),
			traffic: ""
		});
		this.setState(this.state);
	}

	minuseMarch = () => {
		this.state.params.march.splice(this.state.params.march.length -1 ,1);
		this.setState(this.state);
	}

	addInn = () => {
		this.state.params.inn.push({
			beginTime: moment().format('YYYY-MM-DD'),
			endTime: moment().format('YYYY-MM-DD')
		});
		this.setState(this.state);
	}

	minuseInn = () => {
		this.state.params.inn.splice(this.state.params.inn.length -1 ,1);
		this.setState(this.state);
	}

	submit = () => {
		this.state.disabled = true;
		this.setState(this.state);
	}

	selectCity = () => {
		Util.fuzzySelect("cccc", (data) => {
			console.log(data)
		})
	}

	render() {
		console.log(this.props);
		let { innCityList, params, disabled, showCitySelectModule } = this.state;
		return (
			<div className="apply">
				<div className="weui-cells__title">基本信息</div>
				<div className="weui-cells m-t-n">
					<div className="weui-cell bg-white">
		                <div className="weui-cell__bd">
		                    <div className="pull-left">申请人</div>
		                    <div className="pull-right m-r-sm text-light">{ params.nickName }</div>
		                </div>
		                <div className="weui-cell__bd">
		                    <div className="pull-left m-l-sm">部门</div>
		                    <div className="pull-right text-light">{ params.deptName }</div>
		                </div>
		            </div>
		            <div className="weui-cell bg-white p-v-xs">
		                <div className="weui-cell__hd">
		                    <label htmlFor="traveller" className="weui-label">出行人</label>
		                </div>
		                <div className="weui-cell__bd">
		                	<a href="javascript:;" className="user addUser"  onClick={ this.addUser }>
				            	<Icon name="custom-add" className="text-primary" style={{"fontSize":"34px"}}/>
		                	</a>
		                	<For each = "item" of = { params.travellers } index = "index">
		                		<a href="javascript:;" className="user delUser" key={item.userId} onClick={ this.deleteUser.bind(this, index) }> 
		                			<img className="user_avatar" src={item.avatar} />
		                			<div className="user_name">{item.nickName}</div>
		                		</a>
		                	</For>
		                </div>
		            </div>
		            <div className="weui-cell bg-white">
		            	<div className="weui-cell__hd">
		                    <label htmlFor="traveller" className="weui-label">出行事由</label>
		                </div>
		                <div className="weui-cell__bd">
		                    <textarea className="weui-textarea" placeholder="请输入出差事由" rows="2" value={params.reason} onChange={(e) => { params.reason = e.target.value; this.setState(this.state)}}></textarea>
		                </div>
		            </div>
		        </div>
		        <div className="weui-cells__title">出行信息</div>
		        <div className="weui-cells m-t-n">
		        	<For each = "item" of = { params.march } index = "index">
			        	<div className={classnames("m-b-sm", {"m-b-n" : index == params.march.length - 1})} key={index}>
			        		<div className="weui-cell bg-white">
			        			<div className="weui-cell__hd">
				                    <label htmlFor="traveller" className="weui-label">出发</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <input className="weui-input" type="text" placeholder="请输入出发城市" value={item.from} onClick = { this.selectCity }/>
				                </div>
				            </div>
				            <div className="weui-cell bg-white">
			        			<div className="weui-cell__hd">
				                    <label htmlFor="traveller" className="weui-label">抵达</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <input className="weui-input" type="text" placeholder="请输入抵达城市" value={item.to} onClick = { this.selectCity }/>
				                </div>
				            </div>
				            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
				                <div className="weui-cell__hd">
				                    <label htmlFor="date" className="weui-label">日期</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <input className="weui-select" name="date" type="date" value={ item.time } onChange={(e) => { item.time = e.target.value; this.setState(this.state) }}/>
				                </div>
				            </div>
				            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
				                <div className="weui-cell__hd">
				                    <label htmlFor="date" className="weui-label">交通</label>
				                </div>
				                <div className="weui-cell__bd">
				                	<select className="weui-select" name="year" value={item.traffic} onChange={ (e) => { item.traffic = e.target.value; this.setState(this.state) }}>
				                		<option key="" value = "">请选择交通工具</option>
								    	<option key = "02" value = "02">火车</option>
								    	<option key = "01" value = "01">飞机</option>
				                    </select>
				                </div>
				            </div>
			        	</div>
			        </For>
		        	<a href="javascript:;" className="text-center block m-t-xs">
		            	<Icon name="custom-add-circle" className="text-primary" style={{"fontSize":"30px"}} onClick={ this.addMarch }/>
		            	<If condition={params.march.length > 1}>
		            		<Icon name="custom-minuse-circle" className="text-danger m-l-xs" style={{"fontSize":"30px"}} onClick={ this.minuseMarch }/>
		            	</If>
                	</a>
		        </div>
		        <div className="weui-cells__title">住宿信息</div>
		        <div className="weui-cells m-t-n">
		        	<For each = "item" of = { params.inn } index = "index">
			        	<div className={classnames("m-b-sm", {"m-b-n" : index == params.inn.length - 1})} key={index}>
				        	<div className="weui-cell bg-white p-v-xs">
				                <div className="weui-cell__hd">
				                    <label htmlFor="traveller" className="weui-label">住宿人</label>
				                </div>
				                <div className="weui-cell__bd">
				                	<a href="javascript:;" className="user addUser"  onClick={ this.addUser }>
						            	<Icon name="custom-add" className="text-primary" style={{"fontSize":"34px"}}/>
				                	</a>
				                	<For each = "item" of = { params.travellers } index = "index">
				                		<a href="javascript:;" className="user delUser" key={item.userId} onClick={ this.deleteUser.bind(this, index) }> 
				                			<img className="user_avatar" src={item.avatar} />
				                			<div className="user_name">{item.nickName}</div>
				                		</a>
				                	</For>
				                </div>
				            </div>
				            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
				                <div className="weui-cell__hd">
				                    <label htmlFor="date" className="weui-label">入住城市</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <select className="weui-select" name="innCity" value={ item.innCity } onChange={ (e) => { item.innCity = e.target.value; this.setState(this.state);}}>
				                    	<For each = "city" of = { innCityList } index = "index">
				                    		<option value={ city } key={index}>{ city }</option>
				                    	</For>
				                    </select>
				                </div>
				            </div>
				            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
				                <div className="weui-cell__hd">
				                    <label htmlFor="date" className="weui-label">入住日期</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <input className="weui-select" name="beginTime" type="date" value={ item.beginTime } onChange={(e) => { item.beginTime = e.target.value; this.setState(this.state) }}/>
				                </div>
				            </div>
				            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
				                <div className="weui-cell__hd">
				                    <label htmlFor="date" className="weui-label">离开日期</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <input className="weui-select" name="endTime" type="date" value={ item.endTime } onChange={(e) => { item.endTime = e.target.value; this.setState(this.state) }}/>
				                </div>
				            </div>
			            </div>
		            </For>
		            <a href="javascript:;" className="text-center block m-t-xs">
		            	<Icon name="custom-add-circle" className="text-primary" style={{"fontSize":"30px"}} onClick={ this.addInn }/>
		            	<If condition={params.inn.length > 1}>
		            		<Icon name="custom-minuse-circle" className="text-danger m-l-xs" style={{"fontSize":"30px"}} onClick={ this.minuseInn }/>
		            	</If>
                	</a>
		        </div>
		        <div className="weui-flex p-xs">
		        	<div className="weui-flex__item">
		        		<a href="javascript:;" className={classnames("weui-btn", "weui-btn_primary", "m-xs", {"weui-btn_disabled": disabled})} onClick={ this.submit }>提交</a>
		        	</div>
		        </div>
			</div>
		)
	}
}