var webpack = require('webpack')
var config = require('./webpack.base')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
//AppCachePlugin

config.output.filename = '[name].[chunkhash].js'
config.output.chunkFilename = '[id].[chunkhash].js'

var SOURCE_MAP = false

config.devtool = SOURCE_MAP ? 'source-map' : false

config.module.loaders.push({
	test: /\.(less|css)$/,
	loader:ExtractTextPlugin.extract("style-loader", "css-loader!less-loader"),
})
config.module.loaders.push({
		test: /\.scss$/,
		loaders: ["style", "css", "sass"],
		loader:ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader"),
		exclude: /node_modules/
})

config.module.loaders.push({
	test: /\.(js|jsx)$/,
	loaders: ['babel-loader'],
	exclude: /node_modules/
})

config.plugins = (config.plugins || []).concat([
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: '"production"'
		}
	}),
	//代码压缩平时可以不用
	new webpack.optimize.UglifyJsPlugin({
		exclude: [
			 /node_modules\//
		],
		compress: {
			warnings: false
		}
	}),
	new ExtractTextPlugin('[name].[contenthash].css'),
	new HtmlWebpackPlugin({
		filename: '../index.html',
		template: 'index.html'
	})
])

module.exports = config
