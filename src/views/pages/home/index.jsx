import React, { Component } from 'react'
import { Link } from  'react-router'
import classnames from 'classnames';
import Grid from 'components/grid';
import BaseComponent from 'core/baseComponent'
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class Category extends BaseComponent {

	state = {
		gridDataList: [
			{"title":"报销","link":"/expense/audit","icon":"custom-expense"},
			{"title":"差旅","link":"/travel/audit","icon":"custom-travel"},
			{"title":"借还款","link":"https://erp.meili-inc.com/#/app/loan/audits","icon":"custom-lend"},
			{"title":"付款","link":"https://erp.meili-inc.com/#/app/payment/audits","icon":"custom-payment"},
			{"title":"一般花钱","link":"https://erp.meili-inc.com/#/app/feePreApply/commonFeeAudit/","icon":"custom-spend"},
			{"title":"活动花钱","link":"https://erp.meili-inc.com/#/app/feePreApply/activityFeeAudits","icon":"custom-activity"},
			{"title":"合同","link":"https://erp.meili-inc.com/#/app/contract/audits","icon":"custom-contract"},
			{"title":"资产","link":"https://erp.meili-inc.com/#/app/asset/audits","icon":"custom-assets"},
			{"title":"花钱调整","link":"https://erp.meili-inc.com/#/app/feePreApply/myMoneyAjustAudit","icon":"custom-adjust"},
			{"title":"资金调拨","link":"/fund/audit","icon":"custom-fund"},
			{"title":"预算","link":"/budget/audit","icon":"custom-budget"}
		]
	}

	constructor(props){
		super(props);
		Util.setTitle("审批");
	}

	componentDidMount() {
		Ajax.get('api/workflow/getModuleAuditCount',{}).then(res => {
			/* TODO 忍不下去的。。。 */
			this.state.gridDataList[0].number = res.data.expenseNum;
			this.state.gridDataList[1].number = res.data.tripNum;
			this.state.gridDataList[2].number = res.data.loanRepayNum;
			this.state.gridDataList[3].number = res.data.paymentNum;
			this.state.gridDataList[4].number = res.data.purchaseNum;
			this.state.gridDataList[5].number = res.data.activityNum;
			this.state.gridDataList[6].number = res.data.contractNum;
			this.state.gridDataList[7].number = res.data.assetNum;
			this.state.gridDataList[8].number = res.data.amtAdjustNum;
			this.state.gridDataList[9].number = res.data.allocationNum;
			this.state.gridDataList[10].number = res.data.budgetNum;
			this.setState(this.state);
		});
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