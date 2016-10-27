import React, { Component } from 'react'
import classnames from 'classnames';
export default class Icon extends Component {
	render(){
		const { className,name,...props } = this.props
		return(
			<i className={ classnames("weui-icon-" + name, className) } {...props}></i>
		)
	}
}
