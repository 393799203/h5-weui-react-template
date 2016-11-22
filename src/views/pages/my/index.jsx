import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import Grid from 'components/grid';
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class myGrid extends Component {
	state = {
		gridDataList: [
			{"title":"报销","link":"/my/expense","icon":"expense"}
		]
	}

	constructor(props){
		super(props);
		Util.setTitle("我的");
	}

	render() {
		return (
			<Grid gridDataList={this.state.gridDataList}/>
		)
	}
}