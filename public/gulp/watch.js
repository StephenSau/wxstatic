'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

gulp.task('clean', function(){
	return gulp.src(
		['.development'],	{read: false})
		.pipe($.clean());
});

gulp.task('watch', ['dev'], function(){
	//gulp.watch('scripts/**/*', ['scripts']);
	gulp.watch('scss/**/*.scss', ['css']);
});