import React, { Component } from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, IndexRoute, IndexRedirect, Redirect, Route, Link } from 'react-router'
import FastClick from 'fastclick'


//*************补丁**************
import 'whatwg-fetch';
import Es6Promise from 'es6-promise';
import Es6ObjectAssign from 'es6-object-assign';
import 'core/polyfill';

Es6Promise.polyfill();
Es6ObjectAssign.polyfill();
FastClick.attach(document.body)


//*************样式加载**************
// import 'normalize.css';//样式引入
import 'weui/dist/style/weui.css';
import 'style/app.scss';//样式引入

//*************页面引入**************
import Layout from 'views/layout/Layout';
import Category from 'views/pages/home';

//报销
import AuditList from 'views/pages/expense/auditList';
import AuditedList from 'views/pages/expense/auditedList';
import myList from 'views/pages/expense/myList';
import ExpenseApply from 'views/pages/expense/apply';
import ExpenseDetailAudit from 'views/pages/expense/detailAudit';
		

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
	<Router history={ browserHistory }>
		<Route path="/" component={App}>
			<Route component={Layout}>
				<IndexRoute component={ Category }/>
				<Route path="query" />
				<Route path="expense">
					<Route path="apply" component={ ExpenseApply } />
					<Route path="audit" component={ AuditList } />
					<Route path="audited" component={ AuditedList } />
					<Route path="my" component={ myList } />
					<Route path="detail/:id" component={ ExpenseDetailAudit } />
					<Route path="audit/:id" component={ ExpenseDetailAudit } />
				</Route>
				<Route path="fund">
					<Route path="apply" component={ ExpenseApply } />
					<Route path="audit" component={ AuditList } />
					<Route path="audited" component={ AuditedList } />
					<Route path="my" component={ myList } />
					<Route path="detail/:id" component={ ExpenseDetailAudit } />
					<Route path="audit/:id" component={ ExpenseDetailAudit } />
				</Route>
			</Route>
		</Route>
	</Router>
), document.getElementById('appWrapper'));




