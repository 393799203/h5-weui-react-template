import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile'

export default class DefaultLayout extends Component {
	render() {
		return (
			<div>
			    <div style={{ height: 8 }} />
			    <NavBar leftContent="返回" mode="light" 
			    	onLeftClick={() => console.log('onLeftClick')}
				    rightContent={[
				      	<Icon key="0" type="user" />, 
				      	<Icon key="1" type="search" />, 
				      	<Icon key="2" type="plus" />
			      	]}
			    >NavBar</NavBar>
			</div>
		)
	}
}

