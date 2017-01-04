import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import Grid from 'components/grid';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class ApplyCategory extends BaseComponent {

	state = {
		gridDataList: [
			{"title":"差旅","link":"/travel/apply","icon":"custom-travel"}
		]
	}

	constructor(props){
		super(props);
		Util.setTitle("申请");
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