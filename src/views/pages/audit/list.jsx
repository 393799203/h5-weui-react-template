import React, { Component } from 'react'
import { Link } from  'react-router'
import List from 'components/list';

export default class auditList extends Component {
	state = {
		dataSource: [{},{},{}]
	}

	render() {
		let dataSource = this.state.dataSource;
		return (
			<List dataSource={ dataSource } />
		)
	}
}