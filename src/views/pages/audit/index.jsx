import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import Grid from 'components/grid';
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class auditGrid extends Component {
	state = {
		gridDataList: [
			{"title":"报销","link":"/audit/expense","icon":"custom-expense"}
		]
	}

	constructor(props){
		super(props);
		Util.setTitle("待审批");
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