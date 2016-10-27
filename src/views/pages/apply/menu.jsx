import React, { Component } from 'react'
import Grid from 'components/grid'

export default class Menu extends Component {
	state = {
		gridDataList : [
			{link: "/expense", title: "报销", icon: "waiting-circle"},
			{link: "", title: "报销3", icon: "download"},
			{link: "", title: "报销4", icon: "waiting"},
			{link: "", title: "报销5", icon: "circle"}
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