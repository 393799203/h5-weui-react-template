import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import Grid from 'components/grid';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class QueryCategory extends BaseComponent {

	state = {
		gridDataList: [
			/* {"title":"资金日报","link":"/fund/dailyReport","icon":"custom-dailyReport"}, */
			{"title":"部门预算","link":"/budget/deptReport","icon":"custom-deptBudget"}
		]
	}

	constructor(props){
		super(props);
		Util.setTitle("查询");
	}

	componentDidMount() {
		document.addEventListener("reload", function(data){
			window.location.reload();
		}, false);
	}

	render() {
		return (
			<Grid gridDataList={this.state.gridDataList}/>
		)
	}
}