import React, { Component } from 'react'
import { Link } from  'react-router'
import List from 'components/list';
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class auditList extends Component {
	state = {
		params: {
			"outlineType": 3
		},
		ajaxUrl: "/expense/request/getMyOutlineList"
	}

	constructor(props){
		super(props);
		Util.setTitle("报销审批-待审批");
	}

	componentDidMount() {
		document.addEventListener("reload", function(data){
			window.location.reload();
		}, false);
	}

	render() {
		let params = this.state.params;
		let ajaxUrl = this.state.ajaxUrl;
		return (
			<List className="m-t-n" params = { params } ajaxUrl = { ajaxUrl }/>
		)
	}

}