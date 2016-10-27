import React, { Component } from 'react'
import { Link } from  'react-router'

export default class ListItem extends Component {
	state = {
		dataSource: []
	}

	constructor(props){
		super(props);
		this.state.dataSource = props.dataSource;
	}

	componentWillReceiveProps(nextProps) {
	    this.state.dataSource = nextProps.dataSource;
	}

	render() {
		let dataSource = this.state.dataSource;
		return (
			<div className="weui-cells">
				<For each = "item" of = { dataSource } index = "index">
		            <Link className="weui-cell weui-cell_access" key={index} >
		                <div className="weui-cell__hd">
		                	<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=" style={{"width":"20px","marginRight":"5px","display":"block"}} />
		                </div>
		                <div className="weui-cell__bd">
		                    <p>cell standard</p>
		                </div>
		                <div className="weui-cell__ft">说明文字</div>
		            </Link>
	            </For>
	        </div>
		)
	}
}