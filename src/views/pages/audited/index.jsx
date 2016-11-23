import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import Grid from 'components/grid';
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class auditedGrid extends Component {
	state = {
		gridDataList: [
			{"title":"报销","link":"http://erp.meili-inc.com/#/app/expense/audits","icon":"custom-expense"},
			{"title":"差旅","link":"https://erp.meili-inc.com/h5/index.html?_TTtoolbar=0#!/","icon":"custom-travel"},
			{"title":"借还款","link":"http://erp.meili-inc.com/#/app/loan/audits","icon":"custom-lend"},
			{"title":"付款","link":"http://erp.meili-inc.com/#/app/payment/audits","icon":"custom-payment"},
			{"title":"一般花钱","link":"http://erp.meili-inc.com/#/app/feePreApply/commonFeeAudit/","icon":"custom-spend"},
			{"title":"活动花钱","link":"http://erp.meili-inc.com/#/app/feePreApply/activityFeeAudits","icon":"custom-activity"},
			{"title":"合同","link":"http://erp.meili-inc.com/#/app/contract/audits","icon":"custom-contract"},
			{"title":"资产","link":"http://erp.meili-inc.com/#/app/asset/audits","icon":"custom-assets"},
			{"title":"花钱调整","link":"http://erp.meili-inc.com/#/app/feePreApply/myMoneyAjustAudit","icon":"custom-adjust"}
		]
	}

	constructor(props){
		super(props);
		Util.setTitle("已审批");
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