import React, { Component } from 'react'
import Grid from 'components/grid'

export default class Menu extends Component {
	state = {
		gridDataList : [
			{link: "/expense/apply", title: "报销申请", icon: "waiting-circle"},
			{link: "/expense/audit/222", title: "审批单222", icon: "download"},
			{link: "/expense/detail/222", title: "详情单222", icon: "waiting"},
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