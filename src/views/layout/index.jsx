import React, { Component } from 'react'

export default class Layout extends Component {
	render() {
		return (
			<div className = "h-full">
				<div className = "h-full">
					{this.props.children}
				</div>
			</div>
		)
	}
}


