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
import TabLayout from 'views/layout/tabLayout';

import ApplyMenu from 'views/pages/apply/menu';
import AuditList from 'views/pages/audit/list';
import AuditedList from 'views/pages/audited/list';
import Application from 'views/pages/application';

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
			<Route component={TabLayout}>
				<IndexRoute component={ ApplyMenu } />
				<Route path="audit" component={ AuditList } />
				<Route path="audited" component={ AuditedList } />
				<Route path="application" component={ Application } />
				<Redirect from="*" to="/" />
			</Route>
		</Route>
	</Router>
), document.getElementById('appWrapper'));
