import React, { Component } from 'react'
import { render } from 'react-dom'
import { hashHistory, Router, IndexRoute, IndexRedirect, Redirect, Route, Link } from 'react-router'
import FastClick from 'fastclick'

//*************补丁**************
import 'whatwg-fetch';
import Es6Promise from 'es6-promise';
import 'core/polyfill';

Es6Promise.polyfill();
FastClick.attach(document.body)


//*************样式加载**************
import 'normalize.css';//样式引入
import 'style/app.scss';//样式引入

//*************页面引入**************

//app 根组件
class App extends Component {
	render() {
		return (
			<div className="w-full">
				{this.props.children}
			</div>
		)
	}
}

render((
	<Router history={hashHistory}>
		<Route path="/" component={App}>

		</Route>
	</Router>
), document.getElementById('appWrapper'));
