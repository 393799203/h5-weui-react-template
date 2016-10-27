var path = require('path');
var appConf = require('./app.conf');
var proxyPaths = [
	'user',
	'expense'
];
var serverConf = {
	contentBase: path.resolve(__dirname, '..'),
	//progress:true,
	devtool: 'eval-source-map',
	hot: true,
	inline: true,
	proxy: {},
	stats: {
		colors: true
	}
}
proxyPaths.forEach(function(v){
	serverConf.proxy['/'+v+'*'] = {
		target: appConf.proxy,
		changeOrigin: true
	}
});
module.exports = serverConf;

