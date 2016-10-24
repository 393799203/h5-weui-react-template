var path = require('path');
var serverConf = {
	contentBase: path.resolve(__dirname, '../src'),
	progress:false,
	devtool: 'eval-source-map',
	hot: true,
	inline: true,
	proxy: {},
	stats: {
		colors: true
	}
}
var proxyPaths = [
	'message'
];
proxyPaths.forEach(function(v){
	serverConf.proxy['/'+v+"*"] ={
		target: 'http://dev.www.mogujie.org',
		changeOrigin: true
	}
})
module.exports = serverConf;

