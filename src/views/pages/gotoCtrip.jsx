import React, { Component } from 'react'
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class GoToCtrip extends BaseComponent {
	state = {
		token: {}
	}

	constructor(props){
		super(props);
		Ajax.get("/api/trip/getCtripTicket",{applyWorkId: this.props.location.query.applyWorkId}).then((res)=>{
			this.state.token = res.data.map;
			console.log(this.state.token)
			this.setState(this.state);
			setTimeout(()=>{
				document.getElementById('button').click();
			},500)
		})
	}
	
	render() {
		let token = this.state.token;
		return (
			<form style={{"display":"none"}} action="https://ct.ctrip.com/m/SingleSignOn/H5SignInfo" id="H5SignInfo" method="post">
				<input type="hidden" name="Appid" value={token.Appid}/> 
                <input type="hidden" name="AccessUserId" value={token.AppKey}/>
                <input type="hidden" name="AppSecurity" value={token.AppSecurity}/> 
                <input type="hidden" name="Token" value={token.Ticket}/> 
                <input type="hidden" name="EmployeeID" value={token.EmployeeID}/>  
                <input type="hidden" name="InitPage" value="Home" />  
                <input type="hidden" name="Callback" value="https://ct.ctrip.com/m" />  
                <input type="submit" value="机票预订" id="button"/> 
            </form>
		)
	}
}