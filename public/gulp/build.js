'use strict';

var gulp = require('gulp');
var stylish = require('jshint-stylish');

var $ = require('gulp-load-plugins')();

gulp.task('scripts:util', function(){
	return gulp.src([
			'scripts/main.js',
			'scripts/zyb/lib/**/*.js'
		])
		.pipe($.jshint())
		.pipe($.jshint.reporter(stylish))
		.pipe($.concat('util.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('js'))
		.pipe($.filesize());
});

gulp.task('scripts:app', function(){
	return gulp.src([
			'scripts/zyb/app.js',
			'scripts/zyb/model/**/*.js',
			'scripts/zyb/directive/**/*.js',
			'scripts/zyb/controller/**/*.js'
		])
		.pipe($.jshint())
		.pipe($.jshint.reporter(stylish))
		.pipe($.concat('app.js'))
		.pipe(gulp.dest('js'))
		.pipe($.filesize());
});



gulp.task('css', function(){
	return gulp.src('scss/*.scss')
		.pipe($.rubySass({style:'compressed', 'sourcemap=none': true }))
		.on('error', function (err) { console.log(err.message);})
		.pipe(gulp.dest('css'));
		//.pipe($.filesize());
});

gulp.task('css:clean', function () {
	return gulp.src('css/page/base.scss')
		.pipe($.clean());
});




gulp.task('scripts', ['scripts:util', 'scripts:app']);


gulp.task('dev', ['css']);



// Dist

gulp.task('dist:app', function(){
	return gulp.src([
			'scripts/zyb/app.js',
			'scripts/zyb/model/**/*.js',
			'scripts/zyb/directive/**/*.js',
			'scripts/zyb/controller/**/*.js'
		])
		.pipe($.concat('app.js'))
		.pipe($.ngAnnotate())
		.pipe($.uglify({mangle: true}))
		.pipe(gulp.dest('js'))
		.pipe($.filesize());
});


gulp.task('dist', ['dist:app']);