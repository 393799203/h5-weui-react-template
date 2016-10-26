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
// import 'normalize.css';//样式引入
import 'weui/dist/style/weui.css';
import 'style/app.scss';//样式引入

//*************页面引入**************
import Layout from 'views/layout';

import ApplyMenu from 'views/pages/apply/menu';
import ExpenseList from 'views/pages/expense/list';
import ExpenseDetail from 'views/pages/expense/detail';
import ExpenseAudit from 'views/pages/expense/audit';


//app 根组件
class App extends Component {
	render() {
		return (
			<div className="container" id="container">
				<div className="weui-toptips weui-toptips_warn js_tooltips">错误提示</div>
				{this.props.children}
			</div>
		)
	}
}

render((
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<Route component={Layout}>
				<IndexRedirect to="apply/menu" />
				<Route path="apply" >
					<IndexRedirect to="menu" />
					<Route path="menu" component={ ApplyMenu } />
				</Route>
				<Route path="audit" >
					<IndexRedirect to="expense" />
					<Route path=":auditType" component={ ExpenseList } />
				</Route>
				<Route path="audited" key="audited">
					<IndexRedirect to="expense" />
					<Route path=":auditType" component={ ExpenseList }/>
				</Route>
				<Route path="application" key="application">
					<IndexRedirect to="expense" />
					<Route path=":auditType" component={ ExpenseList }/>
				</Route>
				<Redirect from="*" to="/apply/menu" />
			</Route>
		</Route>
	</Router>
), document.getElementById('appWrapper'));
