var path = require('path')
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	cache: true,
	entry: {
		app: ['./src/app.jsx'],
		vendor:['react','react-dom','react-router','flux','whatwg-fetch','es6-promise','rc-queue-anim']
	},
	output: {
		path: path.resolve(__dirname, '../dist/static'),
		publicPath: 'static/',
		filename: '[name].js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		root: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../static')],
		alias: {
			'src': path.resolve(__dirname, '../src'),
			'static': path.resolve(__dirname, '../static'),
			'react-avatar-editor':"@mogu/react-avatar-editor"
		}
	},
	resolveLoader: {
		root: [path.join(__dirname, 'node_modules')]
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name:"vendor",
			minChunks: Infinity
		}),
		new TransferWebpackPlugin([{
			from: 'static'
		}], path.resolve(__dirname, "../"))
	],
	module: {
		loaders: [,
		{
			test: /\.json$/,
			loader: 'json'
		},
		{
			test: /\.(png|jpg|gif)$/,
			loader: 'url',
			query: {
				limit: 10000,
				name: '[name].[ext]?[hash]'
			}
		},
		{
			test: /\.html/,
			loader: 'string',
		},
		{
			test: /\.(eot|woff|ttf|svg)$/,
			loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
		}]
	},
	sassLoader:{
		includePaths: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../static')]
	},
	eslint: {
		formatter: require('eslint-friendly-formatter')
	}
}

