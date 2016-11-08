var React = require('react');
var IScroll = require('iscroll/build/iscroll-probe');
var classnames = require('classnames');
var PullToRefresh = React.createClass({
    getDefaultProps: function() {
        return {
            refreshText: 'Pull to refresh',
            releaseText: 'Release to refresh',
            loadingText: 'Loading',
            refreshIconClass: 'fa fa-arrow-down',
            releaseIconClass: 'fa fa-arrow-down fa-rotate-180',
            loadingIconClass: 'fa fa-refresh fa-spin',
            pullToRefreshThreshold: 100,
            refreshThreshold: 50
        };
    },
    getInitialState: function() {
        return {
            loading: false,
            pulling: false,
            waitingReleaseToRefresh: false
        };
    },
    getScrollWrap: function() {
        return this.refs.scroller;
    },
    componentDidMount: function() {
        this.iscroll = new IScroll(this.getScrollWrap(), {
            mouseWheel: true,
            probeType: 3,
            scrollbars: false
        });
        var me = this;
        this.iscroll.on('scroll', function() {
            me.scrollHandler(this)
        });
        this.getScrollWrap().addEventListener("touchend", this.handlePullRefresh, false);
    },
    componentDidUpdate: function() {
        if (!this.state.pulling) {
            this.iscroll.refresh();
        }
    },
    handlePullRefresh: function() {
        if (this.state.waitingReleaseToRefresh) {
            this.showLoader();
            this.props.onRefresh(this.hideLoader);
        }
    },
    showLoader: function() {
        this.setState({
            waitingReleaseToRefresh: false,
            loading: true
        });
    },
    hideLoader: function() {
        this.setState({
            loading: false
        });
    },
    scrollHandler: function(scroll) {
        var state = this.state;

        //normal scroll
        if (scroll.y <= 1) {
            state.pulling = false;
        }

        //we are pulling
        if (scroll.y > 1) {
            state.pulling = true;
            if (this.props.pullToRefreshThreshold < scroll.y) {
                console.log('REFRESH');
                state.waitingReleaseToRefresh = true;
            } else {
                state.waitingReleaseToRefresh = false;
            }
        }
        this.setState(state);
    },

    renderLoading: function() {
        return (
            <div className="loading">
                <p>{this.props.loadingText}</p>
                <div className="icon"><i className={this.props.loadingIconClass}></i></div>
            </div>
        );
    },
    renderRefresh: function() {

        //prevent the block to be displayed if we are nit pulling
        if (!this.state.pulling) {
            return null;
        }

        var text = this.state.waitingReleaseToRefresh ? this.props.releaseText : this.props.refreshText;
        var iconClass = this.state.waitingReleaseToRefresh ? this.props.releaseIconClass : this.props.refreshIconClass;

        return (
            <div className="refresh">
                <p>{text}</p>
                <div className="icon"><i className={iconClass}></i></div>
            </div>
        );
    },
    render: function() {

        var classNames = classnames({
            'pull-to-refresh': true,
            'loading': this.state.loading,
            'pulling': this.state.pulling,
            'waiting-pull-to-refresh': this.state.waitingPullToRefresh
        });

        var scrollerStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transition: 'all .2s ease-out',
            transform: this.state.loading ? 'translate3d(0,' + this.props.refreshThreshold + 'px,0)' : 'translate3d(0,0,0)'
        };

        var refreshInfos = this.state.loading ? this.renderLoading() : this.renderRefresh();

        return (
            <div className={classNames}>
                {refreshInfos}
                <div ref="scroller" style={scrollerStyle}>
                    <div className="scroller" ref="scroller" style={scrollerStyle}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = PullToRefresh;