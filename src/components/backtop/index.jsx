import React, { Component } from 'react'
import classnames from 'classnames';
import { Link } from  'react-router';
import Icon from 'components/icon';

export default class BackTop extends Component {
	
	state = {
		isShow : false
	}

	backtop = () => {
		this.smoothscroll();
	}

	smoothscroll = () => {
		var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;  
	    if (currentScroll > 0) {  
	         window.requestAnimationFrame(this.smoothscroll);  
	         window.scrollTo (0,currentScroll - (currentScroll/5));  
	    }  
	}

	componentDidMount(){
		document.addEventListener('scroll', () => {
			var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
			if(currentScroll > document.body.offsetHeight && !this.state.isShow){
				this.state.isShow = true;
				this.setState(this.state);
			}
			if(currentScroll <= document.body.offsetHeight && this.state.isShow){
				this.state.isShow = false;
				this.setState(this.state);
			}
		})
	}

	render() {
		let isShow = this.state.isShow;
		return (
			<div className={classnames("weui-backtop",{ "fadeIn" : isShow })} onClick = { this.backtop }>
				<Icon className="backtop" name="custom-backtop"/>
		    </div>
		)
	}
}
