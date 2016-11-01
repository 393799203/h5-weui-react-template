import React, { Component } from 'react'
import { render } from 'react-dom'
import { hashHistory, Router, IndexRoute, IndexRedirect, Redirect, Route, Link } from 'react-router'
import FastClick from 'fastclick'

import Util from 'core/util';

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
import Layout from 'views/layout/Layout';

import ApplyMenu from 'views/pages/apply/menu';
import AuditList from 'views/pages/audit';
import AuditedList from 'views/pages/audited';
import Application from 'views/pages/application';

//报销
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
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<Route component={Layout}>
				<IndexRedirect to="audit"/>
				<Route path="audit" component={ AuditList } />
				<Route path="audited" component={ AuditedList } />
				<Route path="application" component={ Application } />
				<Route path="expense">
					<Route path="apply" component={ ExpenseApply } />
					<Route path="detail(/:id)" component={ ExpenseDetailAudit } />
					<Route path="audit(/:id)" component={ ExpenseDetailAudit } />
				</Route>
				<Redirect from="*" to="/audit" />
			</Route>
		</Route>
	</Router>
), document.getElementById('appWrapper'));
//全局pushWindow
document.getElementById("appWrapper").addEventListener("click", (e) => {
	let target = e.target;
	if( target && target.nodeName.toLocaleLowerCase() == "a" && target.className.indexOf('pushWindow') != -1 && (navigator.userAgent.indexOf('tt4ios') || navigator.userAgent.indexOf('tt4android'))) {
		e.preventDefault();
		Util.pushWindow(target.href);
		return false;
	}
	return true;
},false);
