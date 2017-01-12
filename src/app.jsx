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
FastClick.attach(document.body);


//*************样式加载**************
// import 'normalize.css';//样式引入
import 'weui/dist/style/weui.css';
import 'style/app.scss';//样式引入

//*************页面引入**************
import Layout from 'views/layout/Layout';
//差旅
import TravelAuditList from 'views/pages/auditList';
import TravelAuditedList from 'views/pages/auditedList';
import TravelMyList from 'views/pages/myList';
import TravelApply from 'views/pages/apply';
import TravelDetailAudit from 'views/pages/detailAudit';

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
				<IndexRedirect to="/apply"/>
				<Route path="apply" component={ TravelApply } />
				<Route path="audit" component={ TravelAuditList } />
				<Route path="audited" component={ TravelAuditedList } />
				<Route path="my" component={ TravelMyList } />
				<Route path="detail/:id" component={ TravelDetailAudit } />
				<Route path="audit/:id" component={ TravelDetailAudit } />
				<Redirect from="*" to="/apply" />
			</Route>
		</Route>
	</Router>
), document.getElementById('appWrapper'));




