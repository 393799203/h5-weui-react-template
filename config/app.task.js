var path = require('path')
var gulp = require('gulp');
var svgSymbols = require('gulp-svg-symbols');
var fs = require('fs-extra');

var task = {
	default:function(){
		fs.copy(path.resolve(__dirname, '../dist/static'),path.resolve(__dirname, '../assets/static'),function(){
			console.log("已复制到assets")
		})
	},
	clean:function(){
		fs.remove(path.resolve(__dirname, '../dist'))
		fs.remove(path.resolve(__dirname, '../assets'))
		console.log("文件夹dist、assets已删除")
	},
	svg:function(){
		var rename = require('gulp-rename');

		var renameSvg = function(file){
			if(file.extname == '.svg'){
				file.extname = '.html';
			}
			if(file.extname == '.css'){
				file.extname = '.scss';
			}
		}
		gulp.src(path.resolve(__dirname, '../static/svg/*.svg'))
			.pipe(svgSymbols({
				className:  '.svg-%f'
			}))
			.pipe(rename(renameSvg))
			.pipe(gulp.dest(path.resolve(__dirname, '../static')));
		console.log("完成")
	}
}
module.exports = task;
