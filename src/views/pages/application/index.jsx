import React, { Component } from 'react'
import { Link } from  'react-router'
import List from 'components/list';
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class Application extends Component {
	state = {
		params: {
			"outlineType": 1
		},
		ajaxUrl: "/expense/request/getMyOutlineList"
	}

	constructor(props){
		super(props);
		Util.setTitle("我的报销");
	}

	render() {
		let params = this.state.params;
		let ajaxUrl = this.state.ajaxUrl;
		return (
			<List className="m-t-n" params = { params } ajaxUrl = { ajaxUrl }/>
		)
	}
}