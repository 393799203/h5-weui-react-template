var path = require('path')
var gulp = require('gulp');
var fs = require('fs-extra');

var task = {
  default:function(){
		fs.copy(path.resolve(__dirname, '../dist/static'),path.resolve(__dirname, '../assets/static'),function(){
			console.log("已复制到assets")
		})
  },
	clean:function(){
		fs.remove(path.resolve(__dirname, '../dist/static'))
		fs.remove(path.resolve(__dirname, '../assets'))
		console.log("文件夹dist、assets已删除")
	}
}
module.exports = task;

