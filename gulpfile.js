/*jshint globalstrict: true*/
/*global require:true, console:true*/

'use strict';

var bowerData = require('./bower.json');
var concat = require('gulp-concat');
var embedTemplates = require('gulp-angular-embed-templates');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var path = require('path');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');


function argumentsToArray(args){
	var ary = [];

	for(var n=0; n<args.length; n++){
		ary.push(args[n]);
	}

	return ary;
}

function arrayExtend(){
	var extended = [];
	var items = {};

	argumentsToArray(arguments).forEach(function(arg){
		(arg || []).forEach(function(item){
			if(!items.hasOwnProperty(item)){
				items[item] = true;
				extended.push(item);
			}
		});
	});

	return extended;
}


var watch = {
	js: [
		'./src/index.js',
		'./src/ajax.js',
		'./src/observer.js',
		'./src/watcher.js'
	],
	admin: [
		'./gulpfile.js'
	],
	build: bowerData.main
};

gulp.task('minify', function() {
	gulp.src(watch.js)
		.pipe(replace(/(templateUrl: (?:"|')).*\/(.*?)("|')/g, '$1$2$3'))
		.pipe(embedTemplates())
		.pipe(concat(path.basename(watch.build)))
		.pipe(gulp.dest(path.dirname(watch.build)))
		.on('end', function () {
			gulp.src(watch.build)
				.pipe(sourcemaps.init())
				.pipe(uglify())
				.pipe(rename(path.basename(watch.build).replace('.js','.min.js')))
				.pipe(sourcemaps.write('./'))
				.pipe(gulp.dest(path.dirname(watch.build)));
		});
});

gulp.task('lint', function() {
	return gulp.src(arrayExtend(watch.js, watch.admin))
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});