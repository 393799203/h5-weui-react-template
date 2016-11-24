import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import Grid from 'components/grid';
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class auditGrid extends Component {
	state = {
		gridDataList: [
			{"title":"报销","link":"/audit/expense","icon":"custom-expense","number":"5"},
			{"title":"差旅","link":"https://erp.meili-inc.com/h5/index.html?_TTtoolbar=0#!/","icon":"custom-travel","number":"15"},
			{"title":"借还款","link":"https://erp.meili-inc.com/#/app/loan/audits","icon":"custom-lend","number":"25"},
			{"title":"付款","link":"https://erp.meili-inc.com/#/app/payment/audits","icon":"custom-payment","number":"35"},
			{"title":"一般花钱","link":"https://erp.meili-inc.com/#/app/feePreApply/commonFeeAudit/","icon":"custom-spend"},
			{"title":"活动花钱","link":"https://erp.meili-inc.com/#/app/feePreApply/activityFeeAudits","icon":"custom-activity"},
			{"title":"合同","link":"https://erp.meili-inc.com/#/app/contract/audits","icon":"custom-contract"},
			{"title":"资产","link":"https://erp.meili-inc.com/#/app/asset/audits","icon":"custom-assets"},
			{"title":"花钱调整","link":"https://erp.meili-inc.com/#/app/feePreApply/myMoneyAjustAudit","icon":"custom-adjust"}
		]
	}

	constructor(props){
		super(props);
		Util.setTitle("待审批");
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