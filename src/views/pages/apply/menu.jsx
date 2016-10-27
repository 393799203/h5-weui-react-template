import React, { Component } from 'react'
import Grid from 'components/grid'

export default class Menu extends Component {
	state = {
		gridDataList : [
			{link: "/expense", title: "报销1", icon: "waiting-circle"},
			{link: "/expense", title: "报销2", icon: "download"},
			{link: "/expense", title: "报销3", icon: "waiting"},
			{link: "/expense", title: "报销4", icon: "circle"}
		]
	}
	render() {
		let gridDataList = this.state.gridDataList;
		return (
			<div>
				<Grid gridDataList={ gridDataList } />
			</div>
		)
	}
}