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
		distanceToRefresh:60,
		refreshViewHeight:50,
		loadable:true,
		distanceToLoad:100,
		onRefresh: () => {
			return Promise.resolve()
		},
		onLoad: () => {
			return Promise.resolve()
		}
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
		pulling: false,
		loading: false,
		refreshing: false,
		waitingReleaseToRefresh: false
	}

	getScrollWrap = () => {
        return this.refs.listViewWrap;
    }

	componentDidMount() {
		const options = {
            // iscroll会拦截元素的默认事件处理函数
            preventDefault: true,
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
        let listViewWrap = this.getScrollWrap();
        this.iScrollInstance = new iScroll(listViewWrap, options );
        this.iScrollInstance.on('scroll', this.onScroll );
        this.iScrollInstance.on('scrollEnd', this.onScrollEnd );
        listViewWrap.addEventListener('touchend', this.handlePullRefresh, false);
	}

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.children !== this.props.children){
        	console.log("refreshfinshed")
        	this.iScrollInstance.refresh();
        }
    }

    onScrollEnd = () => {}

	onScroll = () => {
		//滚动加载
		if(this.iScrollInstance.y <= 0){
			this.state.pulling = false;
			if(this.state.loading || !this.props.loadable || this.props.isEnd){
				return;
			}
			let listViewHeight = this.refs.listViewWrap.offsetHeight;
			let scrollHeight = this.refs.scrollWrap.offsetHeight;
			if(-1 * this.iScrollInstance.y + listViewHeight + this.props.distanceToLoad >= scrollHeight){
				this.state.loading = true;
				this.props.onLoad().then(this.hideLoader, this.hideLoader)
			}
		}
		//上拉刷新
		if (this.iScrollInstance.y > 0 ) {
            this.state.pulling = true;
            if(this.state.refreshing || !this.props.refreshable){
				return;
			}
            if ( this.iScrollInstance.y >= this.props.distanceToRefresh && !this.state.waitingReleaseToRefresh) {
            	this.state.waitingReleaseToRefresh = true;
            	this.setState(this.state);
            	this.iScrollInstance.scrollBy(0, -this.props.refreshViewHeight)
            }
            if( this.iScrollInstance.y + this.props.refreshViewHeight < this.props.distanceToRefresh && this.state.waitingReleaseToRefresh){
            	this.state.waitingReleaseToRefresh = false;
            	this.setState(this.state);
            	this.iScrollInstance.scrollBy(0, this.props.refreshViewHeight)
            }
        }
	}

	handlePullRefresh = () => {
		if(this.state.pulling && this.state.waitingReleaseToRefresh){
			this.showRefreshLoader();
            this.props.onRefresh().then(this.hideLoader, this.hideLoader);
		}
    }

    showRefreshLoader = () => {
    	this.state.refreshing = true;
    	this.state.waitingReleaseToRefresh = false;
        this.setState(this.state);
    }

    hideLoader = () => {
    	this.state.loading = false;
    	this.state.refreshing = false;
        this.setState(this.state);
        //refreshing设置为false之后,setState之后pullCls变化，需要重新refresh
        this.iScrollInstance.refresh();
    }

	componentWillUnmount(){
		this.unmount = true;
		this.iScrollInstance.destroy();
	}

	render() {
		const {
			onScroll,				//将滚动事件绑定在body上
			className,				//样式
			refreshViewHeight,		//等待刷新视图高度
			distanceToRefresh,		//刷新下拉间隔
			onRefresh,				//刷新事件
			onLoad,					//加载事件
			refreshable,			//可刷新
			loadable,				//可加载
			isEnd,					//已结束加载
			distanceToLoad,			//加载间隔
			children,
			...props } = this.props

			console.log("render")
		let pullCls = this.state.waitingReleaseToRefresh||this.state.refreshing ? "waiting" : ""; 
		return (
			<div className={classnames("listView",className)} {...props} ref="listViewWrap">
				<div className="scrollWrap" ref="scrollWrap" >
					<If condition={refreshable}>
						<div className={classnames("listView-pullDownView",pullCls)} ref="pullDown">
							<If condition={ !this.state.refreshing && !this.state.waitingReleaseToRefresh }>
								<div className="weui-loadmore">
						            <span className="weui-loadmore__tips">下拉刷新</span>
						        </div>
							</If>
							<If condition={ !this.state.refreshing && this.state.waitingReleaseToRefresh }>
								<div className="weui-loadmore">
						            <span className="weui-loadmore__tips">释放开始刷新</span>
						        </div>
							</If>
							<If condition={ this.state.refreshing }>
								<div className="weui-loadmore">
						            <i className="weui-loading"></i>
						            <span className="weui-loadmore__tips">数据加载中</span>
						        </div>
							</If>
						</div>
					</If>
					<div className="scrollContent">
						{children}
					</div>
					<If condition={loadable && !isEnd}>
						<div className="listView-pullUpView" ref="pullUp">
							<div className="weui-loadmore">
					            <i className="weui-loading"></i>
					            <span className="weui-loadmore__tips">数据加载中</span>
					        </div>
						</div>
					</If>
					<If condition={loadable && isEnd && children.length}>
						<div className="weui-loadmore">
							<div className="weui-loadmore_line weui-loadmore_dot">
				            	<span className="weui-loadmore__tips bg-none"></span>
				            </div>
				        </div>
					</If>
					<If condition={loadable && isEnd && !children.length}>
						<div className="weui-loadmore weui-loadmore_line">
				            <span className="bg-none">暂无数据</span>
				        </div>
					</If>
				</div>
			</div>
		)
	}
}