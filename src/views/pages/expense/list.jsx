import React, { Component } from 'react'
import { Tabs, List } from 'tui';
const ListItem = List.Item;
const TabPane = Tabs.TabPane;

export default class ExpenseList extends Component {
	render() {
		return (
			<div>
				<Tabs defaultActiveKey="1">
				    <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
				    <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
				    <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
				</Tabs>
				<List header="头部" footer="底部">
					<ListItem key="2" arrow hover>
						<div>列表标题1</div>
						<div className="text-lighter">
							测试
						</div>
					</ListItem>
					<ListItem key="3" arrow hover>
						<div>列表标题2</div>
						<div className="text-lighter">
							测试
						</div>
					</ListItem>
				</List>
			</div>
		)
	}
}
