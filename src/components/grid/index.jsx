import React, { Component } from 'react'
import { Link } from  'react-router';
import Icon from 'components/icon';

export default class Grid extends Component {
	static defaultProps = {
		gridDataList : []
	}
	
	state = {}

	render() {
		let gridDataList = this.props.gridDataList;
		return (
			<div className="weui-grids">
				<For each = "item" of = { gridDataList } index = "index">
					<If condition={item.link.indexOf('http')!=-1}>
						<a className="weui-grid bg-white pushWindow" href={item.link} key = {index}>
				            <div className="weui-grid__icon">
				            	<Icon name={item.icon}/>
				            </div>
				            <p className="weui-grid__label">{item.title}</p>
				            <If condition={item.number}>
				            	<div className="weui-grid__number">{item.number}</div>
				            </If>
				        </a>
					<Else />
						<Link className="weui-grid bg-white" to={item.link} key = {index}>
				            <div className="weui-grid__icon">
				            	<Icon name={item.icon}/>
				            </div>
				            <p className="weui-grid__label">{item.title}</p>
				            <If condition={item.number}>
				            	<div className="weui-grid__number">{item.number}</div>
				            </If>
				        </Link>
					</If>
		        </For>
		    </div>
		)
	}
}
