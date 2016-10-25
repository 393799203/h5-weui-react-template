import React, { Component } from 'react'
import Nav from './navBar'

export default class Layout extends Component {
	render() {
		return (
			<div className = "h-full">
				<Nav/>
				<div className = "h-full">
					{this.props.children}
				</div>
			</div>
		)
	}
}


