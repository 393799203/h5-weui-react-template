import React, { Component } from 'react'
import { List } from 'tui';
const ListItem = List.Item;

export default class Test extends Component {
	render() {
		return (
			<div>
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
