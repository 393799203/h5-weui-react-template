#!/usr/bin/env node
var exists = require('fs').existsSync;
var path = require('path');

var taskName = process.argv[2];

var currentDir = path.resolve('.');
require('app-module-path').addPath(path.join(__dirname,'../node_modules'))

var taskFile = 'app.task.js';
console.log(path.join(currentDir,'config',taskFile));
if(!exists(path.join(currentDir,'config',taskFile))){
    console.log("build目录下app.task.js文件不存在，请先创建task文件")
    return;
}


var taskConf = require(path.join(currentDir,'config',taskFile));
taskName = taskName || 'default';
taskConf[taskName]();



