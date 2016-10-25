import React, { Component } from 'react'
import classNames from 'classnames';
import Col from '../col';
export default class Row extends Component {
	render() {
		const { className,gutter,justify,children, ...props } = this.props
		let sty = {};
		let child = children;
		if(gutter){
			sty = {
				paddingLeft:gutter/2,
				paddingRight:gutter/2
			}
			child = React.Children.map(children,(v)=>{
				if(v.type === Col){
					return React.cloneElement(v,{
						gutter:gutter
					})
				}else{
					return v;
				}
			})
		}
		return (
			<div className={classNames("tui-row",(justify?'tui-row-'+justify:''),this.props.className)} style={sty}>
				{child}
			</div>
		)
	}
}
