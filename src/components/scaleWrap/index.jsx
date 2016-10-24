import React, { Component } from 'react'
export default class scaleWrap extends Component{
	render(){
		let sty = {
			paddingBottom:(this.props.scale*100)+"%"
		}
		return (
			<div style={sty} className="ala-scale-wrap">
				<div className="ala-scale-con-wrap">
					{this.props.children}
				</div>
			</div>
		)
	}
}
