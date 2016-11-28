import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import Grid from 'components/grid';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class myGrid extends BaseComponent {
	state = {
		gridDataList: [
			{"title":"报销","link":"/my/expense","icon":"custom-expense"}
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