import React, { Component } from 'react'
import { browserHistory, Link } from  'react-router'
import classnames from 'classnames';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class DailyReport extends BaseComponent {
	state = {
	}

	constructor(props){
		super(props);
		Util.setTitle("资金日报");
	}

	componentDidMount() {
		document.addEventListener("reload", function(data){
			window.location.reload();
		}, false);
	}

	render() {
		return (
			<div>111</div>
		)
	}
}