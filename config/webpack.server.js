var path = require('path');
var appConf = require('./app.conf');
var serverConf = {
	contentBase: path.resolve(__dirname, '..'),
	//progress:true,
	devtool: 'eval-source-map',
	hot: true,
	inline: true,
	proxy: {
		'/api/*' : {
			target: appConf.proxy,
			changeOrigin: true,
			rewrite: function (req){
	        	req.url = req.url.replace(/^\/api(.+)$/,'$1');
	        }
		}
	},
	stats: {
		colors: true
	}
}
module.exports = serverConf;

