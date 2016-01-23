// jshint ignore: start

var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var traceur = require('gulp-traceur');
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

var distDir = '../NickelDemo-iOS/www';
var appDir = './';

gulp.task('default', function (callback) {
	runSequence('vulcanize', 'traceur', 'copy-index', 'inject-traceur', 'minify-html', 'minify-js', 'remove-temp', 'copy-res',
		callback);
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

gulp.task('traceur', function () {
	return gulp.src('build/vulcanized/index.js')
		.pipe(traceur())
		.pipe(rename('index.v.js'))
		.pipe(gulp.dest(distDir));
});

gulp.task('inject-traceur', function () {
	// It's not necessary to read the files (will speed up things), we're only after their paths:
	var sources = gulp.src([distDir + '/traceur-runtime.min.js'], {
		read: false
	});
	return gulp.src(distDir + '/index.v.html')
		// .pipe(inject(sources, {
		// 	relative: true
		// }))
		.pipe(rename('index.html'))
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
	return gulp.src(distDir + '/index.html')
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
	return gulp.src(['./bower_components/traceur-runtime/traceur-runtime.min.js', distDir + '/index.v.js'])
		.pipe(concat('index.js'))
      .pipe(stripDebug())
		.pipe(uglify({
			mangle: true
		}))
		.pipe(gulp.dest(distDir));
});

gulp.task('remove-temp', function () {
	return gulp.src([distDir + '/index.v.*', 'build/vulcanized'], {
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
