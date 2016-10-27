import React, { Component } from 'react'
import { Link } from  'react-router'
import List from 'components/list';
import Ajax from 'core/ajax';

export default class auditList extends Component {
	state = {
		dataSource: [],
		params: {
			"outlineType": 3
		}
	}

	constructor(props){
		super(props);
		let postData = Object.assign({}, this.state.params);
		Ajax.post('/expense/request/getMyOutlineList', postData).then((res)=>{
			this.state.dataSource = res.data.list;
			this.setState(this.state);
		})
	}

	render() {
		let dataSource = this.state.dataSource;
		return (
			<List dataSource={ dataSource } />
		)
	}
}