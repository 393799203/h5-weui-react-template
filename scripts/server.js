#!/usr/bin/env node
var exists = require('fs').existsSync;
var gulp = require('gulp')
var gutil = require('gulp-util')
var open = require('gulp-open')
var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');
var webpackServer = require('webpack-dev-server');

var currentDir = path.resolve('.');
require('app-module-path').addPath(path.join(__dirname,'../node_modules'))

var serverFile = 'webpack.dev.js';
var appConfFile = 'app.conf.js';

var appConf = require(path.join(currentDir,'config',appConfFile));
var webpackDev = require(path.join(currentDir,'config',serverFile));

if(webpackDev.resolveLoader.root){
    if(webpackDev.resolveLoader.root instanceof Array ){
        webpackDev.resolveLoader.root.push(path.join(__dirname,'../node_modules'))
    }else{
        webpackDev.resolveLoader.root = [webpackDev.resolveLoader.root,path.join(__dirname,'../node_modules')]
    }
}else{
    webpackDev.resolveLoader.root = [path.join(__dirname,'../node_modules')]
}

if(webpackDev.resolve.root){
    if(webpackDev.resolve.root instanceof Array ){
        webpackDev.resolve.root.push(path.join(__dirname,'../node_modules'))
    }else{
        webpackDev.resolve.root = [webpackDev.resolve.root,path.join(__dirname,'../node_modules')]
    }
}else{
    webpackDev.resolve.root = [path.join(__dirname,'../node_modules')]
}


var compiler = webpack(webpackDev);

//webpack服务设置
var webpackServerConf = require(path.join(currentDir,'config','webpack.server.js'));
//启动webpack服务
new webpackServer(compiler, webpackServerConf).listen(appConf.port, appConf.serverName, function(err) {
    if (err) throw new gutil.PluginError("webpack-dev-server", err);
    const appWebPath = "http://" + appConf.serverName + ":" + appConf.port;
    //gutil.log("[webpack-dev-server]", appWebPath);
    //打开浏览器
    gulp.src('').pipe(open({
        app: 'google chrome',
        uri: appWebPath
    }));
}.bind(this));

