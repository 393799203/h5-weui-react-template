import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import iScroll from "iscroll/build/iscroll-probe";
import classnames from 'classnames';
import Ajax from 'core/ajax';
import Util from 'core/util';

export default class ListView extends Component {
	static defaultProps = {
		className: "",
		refreshable:true,
		loadable:true,
		distanceToRefresh:70,
		distanceToLoad:50,
		refreshViewHeight:50
	}

	constructor(props){
		super(props)
	}

	setState(data){
		if(this.unmount){
			return;
		}
		super.setState(data)
	}

	state = {
		isTouching: false,
		isOnRefresh: false
	}

	goTop(){
		this.refs.listViewWrap.scrollTop = 0;
	}

	componentDidMount() {
		const options = {
            // 默认iscroll会拦截元素的默认事件处理函数，我们需要响应onClick，因此要配置
            preventDefault: false,
            // 禁止缩放
            zoom: false,
            // 支持鼠标事件，因为我开发是PC鼠标模拟的
            mouseWheel: true,
            // 滚动事件的探测灵敏度，1-3，越高越灵敏，兼容性越好，性能越差
            probeType: 3,
            // 拖拽超过上下界后出现弹射动画效果，用于实现下拉/上拉刷新
            bounce: true,
            // 展示滚动条
            scrollbars: true,
        };
        let listViewWrap = findDOMNode( this.refs.listViewWrap )
        this.iScrollInstance = new iScroll(listViewWrap, options );
        this.iScrollInstance.on('scroll', this.onScroll );
        this.iScrollInstance.on('scrollEnd', this.onScrollEnd );
        this.iScrollInstance.on('touchStart', () => { this.state.isTouching = true });
        this.iScrollInstance.on('touchEnd', () => { this.state.isTouching = false });
	}

	shouldComponentUpdate(nextProps, nextState) {
        nextProps.children !== this.props.children
        return true;
    }

    componentDidUpdate() {
        this.iScrollInstance.refresh();
    }

	onScroll = () => {
		if(this.state.isOnLoading || !this.props.loadable || this.props.isEnd){
			return;
		}
		let listViewHeight = this.refs.listViewWrap.offsetHeight;
		let scrollHeight = this.refs.scrollWrap.offsetHeight;
		console.log(-1 * this.iScrollInstance.y + listViewHeight + this.props.distanceToLoad, scrollHeight)
		if(-1 * this.iScrollInstance.y + listViewHeight + this.props.distanceToLoad >= scrollHeight){
			this.state.isOnLoading = true;
			if(this.props.onLoad){
				this.props.onLoad().then(()=>{
					setTimeout(()=>{
						this.state.isOnLoading = false;
					},100)
				}).catch((e)=>{
					setTimeout(()=>{
						this.state.isOnLoading = false;
					},100)
				})
			}
		}
		/* let pullDown = findDOMNode( this.refs.PullDown );
 		if (this.iScrollInstance.y > this.props.distanceToRefresh) {
 			this.props.onRefresh();
        } else {
            console.log(2);
        } */

	}

	onScrollEnd = () => {
	}

	componentWillUnmount(){
		this.unmount = true;
	}

	render() {
		const {
			onScroll,				//将滚动事件绑定在body上
			className,				//样式
			refreshViewHeight,		//等待刷新视图高度
			pullDownView,			//下拉刷新展示视图
			distanceToRefresh,		//刷新下拉间隔
			onRefresh,				//刷新事件
			pullUpView,				//上拉加载展示视图
			onLoad,					//加载事件
			refreshable,			//可刷新
			loadable,				//可加载
			isEnd,					//已结束加载
			distanceToLoad,			//加载间隔
			children,
			...props } = this.props
		return (
			<div className={classnames("listView",className)} {...props} ref="listViewWrap">
				<div className="listViewWrap" ref="scrollWrap">
					<If condition={refreshable}>
						<div className="listView-pullDownView" ref="pullDown">
							<If condition={!pullDownView}>
								<If condition={!this.state.isOnRefresh}>
									<div className="weui-loadmore">
							            <i className="weui-loading"></i>
							            <span className="weui-loadmore__tips">下拉刷新</span>
							        </div>
								</If>
								<If condition={this.state.isOnRefresh}>
									<div className="weui-loadmore">
							            <i className="weui-loading"></i>
							            <span className="weui-loadmore__tips">数据加载中</span>
							        </div>
								</If>
							</If>
							<If condition={pullDownView}>
								{pullDownView}
							</If>
						</div>
					</If>
					<div className="scrollContent">
						{children}
					</div>
					<If condition={loadable && !isEnd && !this.state.isOnRefresh}>
						<div className="listView-pullUpView" ref="pullUp">
							<If condition={!pullUpView}>
								<div className="weui-loadmore">
						            <i className="weui-loading"></i>
						            <span className="weui-loadmore__tips">数据加载中</span>
						        </div>
							</If>
							<If condition={pullUpView}>
								{pullUpView}
							</If>
						</div>
					</If>
					<If condition={loadable && isEnd && !this.state.isOnRefresh}>
						<div className="weui-loadmore">
							<div className="weui-loadmore_line weui-loadmore_dot">
				            	<span className="weui-loadmore__tips bg-none"></span>
				            </div>
				        </div>
					</If>
				</div>
			</div>
		)
	}
}