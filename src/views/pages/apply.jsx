import React, { Component } from 'react';
import { browserHistory, Link } from  'react-router'
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
			deptName: "",
			deptId: "",
			travellers: [],
			reason: "",
			marches: [{
				fromCity: "",
				toCity: "",
				departDate: moment().format('YYYY-MM-DD'),
				trafficType: ""
			}],
			inns: [{
				innCity: "",
				innTravellers: [],
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
			this.state.params.deptId = res[0].data.biz1thDeptId;
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
		let deletedUsers = this.state.params.travellers.splice(index, 1);
		this.checkDeleteInnTraveller(deletedUsers[0]);
		this.setState(this.state);
	}

	addInnTravellers = (item) => {
		let userIds = item.innTravellers.map((innTraveller, index) => innTraveller.userId);
		// console.log(this.state.params.travellers)
		Util.fuzzyUser(userIds ,this.state.params.travellers, (data) => {
			item.innTravellers = data;
			this.setState(this.state);
		});
	}

	deleteInnTraveller = (item, index) => {
		item.innTravellers.splice(index, 1);
		this.setState(this.state);
	}

	checkDeleteInnTraveller = (user) => {
		this.state.params.inns.forEach((inn) => {
			let index = -1;
			for(var i = 0; i < inn.innTravellers.length; i++){
				if(inn.innTravellers[i].userId == user.userId){
					index = i;
				}
			}
			if(index != -1){
				inn.innTravellers.splice(index, 1);
			}
		})
	}

	simpleUser = (user) => {
		return {
			avatar: user.avatar || user.avatar_url,
			nickName: user.nickName || user.user_nick_name,
			userId: parseInt(user.userId || user.user_id)
		}
	}

	addMarch = () => {
		this.state.params.marches.push({
			fromCity: "",
			toCity: "",
			departDate: moment().format('YYYY-MM-DD'),
			trafficType: ""
		});
		this.setState(this.state);
	}

	minuseMarch = () => {
		this.state.params.marches.splice(this.state.params.marches.length -1 ,1);
		this.setState(this.state);
	}

	addInn = () => {
		this.state.params.inns.push({
			innCity: "",
			innTravellers: [],
			beginTime: moment().format('YYYY-MM-DD'),
			endTime: moment().format('YYYY-MM-DD')
		});
		this.setState(this.state);
	}

	minuseInn = () => {
		this.state.params.inns.splice(this.state.params.inns.length -1 ,1);
		this.setState(this.state);
	}

	submit = () => {
		let postData = this.processData();
		Util.startLoading("处理中~");
		this.state.disabled = true;
		this.setState(this.state);
		Ajax.post('/api/trip/apply', postData).then(res => {
			Util.success("操作成功", 1500, ()=>{
				browserHistory.replace('/my');
			});
			this.state.disabled = false;
			this.setState(this.state);
		}, (err) => {
			this.state.disabled = false;
			this.setState(this.state);
		})
	}

	processData = () => {
		let params = JSON.parse(JSON.stringify(this.state.params));//深拷贝
		params.travellers.forEach((item, index)=>{
			params.travellers[index] = item.nickName;
		})
		//转出行时间格式
		params.marches.forEach((item, index)=>{
			item.departDate = moment(item.departDate, 'YYYY-MM-DD').format('YYYYMMDD')
		})
		//转人员数据格式
		params.inns.forEach((item, index)=>{
			item.innTravellers.forEach((traveller, ii)=>{
				params.inns[index].innTravellers[ii] = traveller.nickName;
			})
		})
		return params
	}

	selectCity = (item, key, index, ev) => {
		ev.preventDefault();
		Util.fuzzySelect("/api/base/city/getTripHotelList", null, (data) => {
			item[key] = data['cityName'];
			if(key == 'toCity'){
				this.state.innCityList[index] = data;
			}
			this.setState(this.state);
		}, 'cityName');
	}

	render() {
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
		        	<For each = "march" of = { params.marches } index = "index">
			        	<div className={classnames("m-b-sm", {"m-b-n" : index == params.marches.length - 1})} key={index}>
			        		<div className="weui-cell bg-white">
			        			<div className="weui-cell__hd">
				                    <label htmlFor="traveller" className="weui-label">出发</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <input className="weui-input" type="text" placeholder="请输入出发城市" value={march.fromCity} onClick = { this.selectCity.bind(this, march, 'fromCity', index) }/>
				                </div>
				            </div>
				            <div className="weui-cell bg-white">
			        			<div className="weui-cell__hd">
				                    <label htmlFor="traveller" className="weui-label">抵达</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <input className="weui-input" type="text" placeholder="请输入抵达城市" value={march.toCity} onClick = { this.selectCity.bind(this, march, 'toCity', index) }/>
				                </div>
				            </div>
				            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
				                <div className="weui-cell__hd">
				                    <label htmlFor="date" className="weui-label">日期</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <input className="weui-select" name="date" type="date" value={ march.departDate } onChange={(e) => { march.departDate = e.target.value; this.setState(this.state) }}/>
				                </div>
				            </div>
				            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
				                <div className="weui-cell__hd">
				                    <label htmlFor={`traffoc${index}`} className="weui-label">交通</label>
				                </div>
				                <div className="weui-cell__bd">
				                	<select className="weui-select" id={`traffoc${index}`} value={ march.trafficType } onChange={ (e) => { march.trafficType = e.target.value; this.setState(this.state) }}>
				                		<option key="" value = "">请选择交通工具</option>
				                		<option key = "2" value = "2">汽车</option>
								    	<option key = "0" value = "0">火车</option>
								    	<option key = "1" value = "1">飞机</option>
				                    </select>
				                </div>
				            </div>
			        	</div>
			        </For>
		        	<a href="javascript:;" className="text-center block m-t-xs">
		            	<Icon name="custom-add-circle" className="text-primary" style={{"fontSize":"30px"}} onClick={ this.addMarch }/>
		            	<If condition={params.marches.length > 1}>
		            		<Icon name="custom-minuse-circle" className="text-danger m-l-xs" style={{"fontSize":"30px"}} onClick={ this.minuseMarch }/>
		            	</If>
                	</a>
		        </div>
		        <div className="weui-cells__title">住宿信息</div>
		        <div className="weui-cells m-t-n">
		        	<For each = "inn" of = { params.inns } index = "index">
			        	<div className={classnames("m-b-sm", {"m-b-n" : index == params.inns.length - 1})} key={index}>
				        	<div className="weui-cell bg-white p-v-xs">
				                <div className="weui-cell__hd">
				                    <label htmlFor="traveller" className="weui-label">住宿人</label>
				                </div>
				                <div className="weui-cell__bd">
				                	<a href="javascript:;" className="user addUser"  onClick={ this.addInnTravellers.bind(this, inn) }>
						            	<Icon name="custom-add" className="text-primary" style={{"fontSize":"34px"}}/>
				                	</a>
				                	<For each = "innTraveller" of = { inn.innTravellers } index = "index">
				                		<a href="javascript:;" className="user delUser" key={innTraveller.userId} onClick={ this.deleteInnTraveller.bind(this, inn, index) }> 
				                			<img className="user_avatar" src={innTraveller.avatar} />
				                			<div className="user_name">{innTraveller.nickName}</div>
				                		</a>
				                	</For>
				                </div>
				            </div>
				            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
				                <div className="weui-cell__hd">
				                    <label htmlFor={`innCity${index}`} className="weui-label">入住城市</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <select className="weui-select" id={`innCity${index}`} value={ inn.innCity } onChange = { (e)=>{ inn.innCity = e.target.value; this.setState(this.state) }}>
				                    	<option value="" key="">请选择入住城市</option>
				                    	<For each = "city" of = { innCityList } index = "index">
				                    		<option value={ city.cityName } key={ index }>{ city.cityName }</option>
				                    	</For>
				                    </select>
				                </div>
				            </div>
				            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
				                <div className="weui-cell__hd">
				                    <label htmlFor="date" className="weui-label">入住日期</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <input className="weui-select" name="beginTime" type="date" value={ inn.beginTime } onChange={(e) => { inn.beginTime = e.target.value; this.setState(this.state) }}/>
				                </div>
				            </div>
				            <div className="weui-cell weui-cell_select weui-cell_select-after bg-white">
				                <div className="weui-cell__hd">
				                    <label htmlFor="date" className="weui-label">离开日期</label>
				                </div>
				                <div className="weui-cell__bd">
				                    <input className="weui-select" name="endTime" type="date" value={ inn.endTime } onChange={(e) => { inn.endTime = e.target.value; this.setState(this.state) }}/>
				                </div>
				            </div>
			            </div>
		            </For>
		            <a href="javascript:;" className="text-center block m-t-xs">
		            	<Icon name="custom-add-circle" className="text-primary" style={{"fontSize":"30px"}} onClick={ this.addInn }/>
		            	<If condition={params.inns.length > 1}>
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