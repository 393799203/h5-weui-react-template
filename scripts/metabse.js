#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var assetsDir = path.resolve(__dirname, '../assets/static')
var currentDir = path.resolve('.');
var metabaseSetOnlineDir = path.resolve(__dirname,'../metabase_set/online');
var metabaseSetDevelopDir = path.resolve(__dirname,'../metabase_set/develop');

// 用 promise 链式实现
// 测试方法：命令行 node scripts/metabase.js


// 创建测试 metabase 配置
 readDir()
 	.then(filterFiles)
 	.then(developPath)
 	.then(print)
 	.then(write)


// 创建线上metabase 配置
readDir()
	.then(filterFiles)
	.then(onlinePath)
	.then(print)
	.then(write)


// 获取文件列表
function readDir(){
	var files = fs.readdirSync(assetsDir);
	return Promise.resolve(files);
}

// 从目标文件列表中过滤出指定文件 app\vendor css、js
function filterFiles(files){
	return files.filter(function(file){
		var match =/^(app|vendor)\.[\w]*\.(js|css)$/;
		return match.test(file);
	});
}

// 拼接资源前缀
// http://static.mogujie.com/__newtown/pc-finance-frontend/assets/static/
function developPath(files){
	return files.map(function(file){
		return 'http://static.mogujie.com/__newtown/pc-finance-frontend/assets/static/'+file;
	});
}

// https://s10.mogucdn.com/__newtown/pc-finance-frontend/assets/static/
function onlinePath( files ){
	return files.map(function(file){
		return 'https://s10.mogucdn.com/__newtown/pc-finance-frontend/assets/static/'+file;
	});
}

// 拼接资源 css 和 js 按 # 号分隔
// 创建文件到 assets 目录下
// 生成文件
function print(files){
	var resultObj = processFile(files);
	var result = resultObj.resulatArray;
	var isOnline = resultObj.isOnline;

	if(isOnline){
		console.log('***********线上metabase配置数据***********');
	}else{
		console.log('***********线下metabase配置数据***********');
	}
	console.log(result,'\n\n');
	return result;
}
function processFile(files){
	var jsArray = [];
	var cssArray = [];
	var isOnline = /^(https)/.test(files[0])?true:false;

	//将js 与css 分开存储
	files.forEach(function(file){
		if(/(css)$/.test(file)){
			cssArray.push(file);
		}else{
			if(/vendor/.test(file)){
				jsArray.unshift(file);
			}else{
				jsArray.push(file);
			}
		}
	});
	//加入错误收集js
	if(isOnline){
		jsArray.push('http://s10.mogucdn.com/__newtown/iip_error_frontend/assets/static/err.9412b780a6d237e321b3.js');
	}else{
		jsArray.push('http://s10.mogucdn.com/__newtown/iip_error_frontend/assets/static/errdev.4c49c21925cb5ab99796.js');
	}
	//用＃号将css与js连接
	var resultArray = [];
	resultArray.push(cssArray.join(';'));
	resultArray.push(jsArray.join(';'));
	return { 
		resulatArray:resultArray.join('#'),
		isOnline:isOnline
	};
}
//将生成的metabse配置数据字符串写入文件夹进行存储
function write(str){

	var time = moment().format();
	var metabsePath = /^(https)/.test(str)?metabaseSetOnlineDir:metabaseSetDevelopDir;
	var name = '/'+time+'.txt';
	var files = fs.readdirSync(metabsePath);
	if(files.length >= 5){
		var earlyFile = files[0];
		fs.unlinkSync(metabsePath+'/'+earlyFile);
	}
	fs.writeFile(metabsePath+name,str,function(err){
		if(err){
			return console.log(err);
		}
		console.log("saved");
	})
	
}





