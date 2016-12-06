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
import ExpenseAuditList from 'views/pages/expense/auditList';
import ExpenseAuditedList from 'views/pages/expense/auditedList';
import ExpenseMyList from 'views/pages/expense/myList';
import ExpenseApply from 'views/pages/expense/apply';
import ExpenseDetailAudit from 'views/pages/expense/detailAudit';
//资金
import FundAuditList from 'views/pages/fund/auditList';
import FundAuditedList from 'views/pages/fund/auditedList';
import FundMyList from 'views/pages/fund/myList';
import FundDetailAudit from 'views/pages/fund/detailAudit';
		

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
					<Route path="audit" component={ ExpenseAuditList } />
					<Route path="audited" component={ ExpenseAuditedList } />
					<Route path="my" component={ ExpenseMyList } />
					<Route path="detail/:id" component={ ExpenseDetailAudit } />
					<Route path="audit/:id" component={ ExpenseDetailAudit } />
				</Route>
				<Route path="fund">
					<Route path="audit" component={ FundAuditList } />
					<Route path="audited" component={ FundAuditedList } />
					<Route path="my" component={ FundMyList } />
					<Route path="detail/:id" component={ FundDetailAudit } />
					<Route path="audit/:id" component={ FundDetailAudit } />
				</Route>
			</Route>
		</Route>
	</Router>
), document.getElementById('appWrapper'));




