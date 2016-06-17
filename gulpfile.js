/*jshint globalstrict: true*/
/*global require:true, console:true*/

'use strict';

const concat = require('gulp-concat');
const embedTemplates = require('gulp-angular-embed-templates');
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const path = require('path');
const rename = require("gulp-rename");
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");


function argumentsToArray(args){
	return Array.prototype.slice.call(args);
}

function arrayExtend(){
	let extended = [];
	let items = {};

	argumentsToArray(arguments).forEach(arg => {
		(arg || []).forEach(item => {
			if(!items.hasOwnProperty(item)){
				items[item] = true;
				extended.push(item);
			}
		});
	});

	return extended;
}


const watch = {
	js: [
		'./src/index.js',
		'./src/objectPath.js',
		'./src/bolt.js',
		'./src/ajax.js',
		'./src/observer.js',
		'./src/watcher.js',
		'./src/directive.js',
		'./src/worker.js',
		'./src/dynamicLoader/index.js',
		'./src/animation.js',
		'./src/animate/index.js',
		'./src/animate/bounce.js',
		'./src/animate/flash.js',
		'./src/animate/headShake.js',
		'./src/animate/jello.js',
		'./src/animate/pulse.js',
		'./src/animate/rubberBand.js',
		'./src/animate/shake.js',
		'./src/animate/tada.js',
		'./src/animate/swing.js',
		'./src/animate/wobble.js'
	],
	admin: [
		'./gulpfile.js'
	],
	build: "./index.js"
};

gulp.task('minify', () => {
	gulp.src(watch.js)
		.pipe(sourcemaps.init())
		.pipe(replace(/(templateUrl: (?:"|')).*\/(.*?)("|')/g, '$1$2$3'))
		.pipe(embedTemplates())
		.pipe(concat(path.basename(watch.build)))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(path.dirname(watch.build)))
		.on('end', function () {
			gulp.src(watch.build)
				.pipe(sourcemaps.init())
				.pipe(babel())
				.pipe(uglify())
				.pipe(rename(path.basename(watch.build).replace('.js','.min.js')))
				.pipe(sourcemaps.write('./'))
				.pipe(gulp.dest(path.dirname(watch.build)));
		});
});

gulp.task('lint', () => {
	return gulp.src(arrayExtend(watch.js, watch.admin))
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});