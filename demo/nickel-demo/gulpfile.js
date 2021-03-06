// jshint ignore: start

var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var rimraf = require('gulp-rimraf');
var inject = require('gulp-inject');
var minifyHTML = require('gulp-minify-html')
var minifyInline = require('gulp-minify-inline');
var cheerio = require('gulp-cheerio');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
const babel = require('gulp-babel');

var distDir = '../NickelDemo-iOS/www';
var appDir = './';


gulp.task('default', function (callback) {
	runSequence('update-nickel-elements', 'vulcanize', 'babel', 'copy-index', 'minify-html', 'minify-js', 'remove-temp', 'copy-res',
		callback);
});

gulp.task('update-nickel-elements', function (callback) {
	runSequence('delete-nickel-elements', 'copy-nickel-elements', callback);
});


gulp.task('copy-nickel-elements', function () {
	return gulp.src(['../../*.html', '../../*.js'])
		.pipe(gulp.dest('./bower_components/nickel-elements/'));
});

gulp.task('delete-nickel-elements', function () {
	return gulp.src(['./bower_components/nickel-elements'], {
			read: false
		})
		.pipe(rimraf({
			force: true
		}));
});

gulp.task('clean', function () {
	return gulp.src(['build'], {
			read: false
		})
		.pipe(rimraf({
			force: true
		}));
});

gulp.task('vulcanize', function () {
	return gulp.src(appDir +'/index.html')

	.pipe(vulcanize({
			abspath: '/',
			strip: true,
			inlineScripts: true,
			inlineCss: true,
			excludes: [],
			stripExcludes: false,
			stripComments: true
		}))
		.pipe(crisper({
			scriptInHead: false, // true is default
			onlySplit: false
		}))
		.pipe(gulp.dest('build/vulcanized'));
});


gulp.task('copy-index', function () {
	return gulp.src('build/vulcanized/index.html')
		.pipe(rename('index.v.html'))
		.pipe(gulp.dest(distDir));
});

gulp.task('babel', function () {
	return gulp.src('build/vulcanized/index.js')
		.pipe(babel({
            presets: ['es2015']
        }))
		.pipe(rename('index.v.js'))
		.pipe(gulp.dest(distDir));
});

gulp.task('minify-html', function () {
	var css_js_options = {
		js: {
			compress: {
				drop_console: true,
				dead_code: true,
				drop_debugger: true,
				join_vars: true,
			},
		},
		jsSelector: 'script', //jsSelector: 'script[type!="text/x-handlebars-template"]',
		css: false,
	};
	return gulp.src(distDir + '/index.v.html')
		.pipe(minifyHTML({
			quotes: true,
			empty: true,
			spare: true
		})).pipe(minifyInline(css_js_options))
		// Custom optimize CSS..................
		.pipe(cheerio(function ($, file) {
			// OPTIMIZE CSS
			$('style').each(function () {
				var style = $(this);
				style.text(style.text()
					.replace(/^[ \t]+/mg, '') // remove indentations
					.replace(/[ \t]*\/\*(.|[\n\r])*?\*\//g, '') // remove comments
					.replace(/[\n\r]+/g, '\n') //
					.replace(/;[\n\r\t ]+/g, ';') //
					.replace(/,[\n\r\t ]+/g, ',')
					.replace(/[ \t\n\r]+{/g, '{')
					.replace(/{[ \t\n\r]+/g, '{')
					.replace(/[ \t\n\r;]+}/g, '}')
					.replace(/}[ \t\n\r]+/g, '}')
					.replace(/:[ \t\n\r]+/g, ':')
				);
			});
		}))
		.pipe(gulp.dest(distDir));
});

gulp.task('minify-js', function () {
	return gulp.src(['./bower_components/babel-polyfill/browser-polyfill.js', distDir + '/index.v.js'])
		.pipe(concat('index.js'))
      // .pipe(stripDebug())
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest(distDir));
});

gulp.task('remove-temp', function () {
	return gulp.src([distDir + '/index.v.*', 'build'], {
			read: false
		})
		.pipe(rimraf({
			force: true
		}));
});

gulp.task('copy-res', function () {
	return gulp.src(['./res/**/*'])
		.pipe(gulp.dest(distDir+ '/res'));
});
