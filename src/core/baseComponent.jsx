import React, { Component } from 'react';
import Ajax from 'core/ajax';
export default class BaseComponent extends Component {
	state = {}

	unmount = false

	constructor(props){
		super(props);
	}

	setState(data){
		if(this.unmount){
			return;
		}
		super.setState(data)
	}

	componentDidMount() {
	    
	}

	componentWillUnmount() {
		this.unmount = true;
	}
}