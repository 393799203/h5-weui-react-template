import React, { Component } from 'react'
import { render } from 'react-dom'
import { hashHistory, Router, IndexRoute, IndexRedirect, Redirect, Route, Link } from 'react-router'
import FastClick from 'fastclick'

//*************补丁**************
import 'whatwg-fetch';
import Es6Promise from 'es6-promise';
import Es6ObjectAssign from 'es6-object-assign';
import 'core/polyfill';

Es6Promise.polyfill();
FastClick.attach(document.body)


//*************样式加载**************
import 'normalize.css';//样式引入
import 'style/app.scss';//样式引入

//*************页面引入**************
import Layout from 'views/layout';

import Home from 'views/pages/home';
import ExpenseList from 'views/pages/expense/list';
import ExpenseDetail from 'views/pages/expense/detail';
import ExpenseAudit from 'views/pages/expense/audit';


//app 根组件
class App extends Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		)
	}
}

render((
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<Route component={Layout}>
				<IndexRoute component={Home}/>
				<Route path="list" >
					<IndexRedirect to="expense" />
					<Route path=":auditType" component={ ExpenseList }/>
				</Route>
				<Route path="detail">
					<Route path="expense(/:id)" component={ ExpenseDetail }/>
				</Route>
				<Route path="audit">
					<Route path="expense(/:id)" component={ ExpenseAudit }/>
				</Route>
				<Redirect from="*" to="/list" />
			</Route>
		</Route>
	</Router>
), document.getElementById('appWrapper'));
