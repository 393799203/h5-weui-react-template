import React, { Component } from 'react'
import { Link } from  'react-router'
import List from 'components/list';
import Ajax from 'core/ajax';

export default class auditList extends Component {
	state = {
		params: {
			"outlineType": 3
		},
		ajaxUrl: "/expense/request/getMyOutlineList"
	}

	constructor(props){
		super(props);
	}

	render() {
		let params = this.state.params;
		let ajaxUrl = this.state.ajaxUrl;
		return (
			<List className="m-t-n" params = { params } ajaxUrl = { ajaxUrl }/>
		)
	}
}