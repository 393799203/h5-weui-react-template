import React, { Component } from 'react'
import route from 'core/route';

export default class Router extends Component {
	constructor(props){
		super(props);
		this.state = route.current;
	}
	componentDidMount(){
		route.on("change",this.changePage.bind(this));
	}
	changePage(){
		this.setState(route.current);
	}
	render() {
		let RoutePage = this.state.page;
		return (
			<RoutePage />
		)
	}
}

