#!/usr/bin/env node

var exists = require('fs').existsSync;
var gutil = require('gulp-util')
var path = require('path');
var webpack = require('webpack');

var currentDir = path.resolve('.');
require('app-module-path').addPath(path.join(__dirname,'../node_modules'))

var buildFile = 'webpack.build.js';

var webpackBuild = require(path.join(currentDir,'config',buildFile));

if(webpackBuild.resolveLoader.root){
    if(webpackBuild.resolveLoader.root instanceof Array ){
        webpackBuild.resolveLoader.root.push(path.join(__dirname,'../node_modules'))
    }else{
        webpackBuild.resolveLoader.root = [webpackBuild.resolveLoader.root,path.join(__dirname,'../node_modules')]
    }
}else{
    webpackBuild.resolveLoader.root = [path.join(__dirname,'../node_modules')]
}

if(webpackBuild.resolve.root){
    if(webpackBuild.resolve.root instanceof Array ){
        webpackBuild.resolve.root.push(path.join(__dirname,'../node_modules'))
    }else{
        webpackBuild.resolve.root = [webpackBuild.resolve.root,path.join(__dirname,'../node_modules')]
    }
}else{
    webpackBuild.resolve.root = [path.join(__dirname,'../node_modules')]
}

console.log("开始打包")
var compiler = webpack(webpackBuild, function(err, stats) {
    console.log("打包成功")
    if (err) throw new gutil.PluginError("webpack", err);
    console.log(stats)
    gutil.log("[webpack]", stats.toString({}));
});

