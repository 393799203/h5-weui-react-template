var webpack = require('webpack')
var config = require('./webpack.base')
var appConf = require('./app.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');

config.output.filename = '[name].js'
config.output.chunkFilename = '[id].js'

var SOURCE_MAP = true

config.devtool = SOURCE_MAP ? 'eval-source-map': false

//开发的时候，不合并css，可以实时刷新样式
config.module.loaders.push({
		test: /\.less$/,
		loaders: ["style", "css", "less"]
})

config.module.loaders.push({
		test: /\.(scss|css)$/,
		loaders: ["style", "css", "sass"]
})

config.module.loaders.push({
	test: /\.(js|jsx)$/,
	loaders: ['react-hot', 'babel-loader'],
	exclude: /node_modules/
})

config.entry.app.unshift("webpack-dev-server/client?http://"+appConf.serverName+":"+appConf.port+"/", "webpack/hot/dev-server");

function generateExtractLoaders(loaders) {
	return loaders.map(function(loader) {
		return loader + '-loader' + (SOURCE_MAP ? '?sourceMap': '')
	}).join('!')
}

config.output.publicPath = '/'

config.plugins = (config.plugins || []).concat([
new webpack.optimize.OccurenceOrderPlugin(),
new webpack.HotModuleReplacementPlugin(),
new webpack.NoErrorsPlugin(),
new ExtractTextPlugin('[name].css'),
new HtmlWebpackPlugin({
	filename: 'index.html',
	template: 'static/index.html'
}),
new OpenBrowserWebpackPlugin({ url: "http://"+appConf.serverName+":"+appConf.port })
])

module.exports = config
