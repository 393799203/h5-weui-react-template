import React, { Component } from 'react'
import classNames from 'classnames';
export default class Col extends Component {
	render() {
		const { className,span,children,gutter,style, ...props } = this.props

		let sty = style;
		if(!sty){
			sty = {};
		}
		if(gutter){
			if(!sty.paddingLeft){
				sty.paddingLeft = gutter/2;
			}
			if(!sty.paddingRight){
				sty.paddingRight = gutter/2;
			}
		}
		return (
			<div className={classNames("tui-col-"+span,className)} style={sty}>
				{children}
			</div>
		)
	}
}
