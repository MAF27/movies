// Gulp Dependencies
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var compass = require('gulp-compass');
var minifyHTML = require('gulp-minify-html');
var buffer = require('vinyl-buffer');

// Build Dependencies
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');

// Style Dependencies
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// Development Dependencies
var jshint = require('gulp-jshint');

var env,
	jsSources,
	sassSources,
	htmlSources,
	outputDir,
	sassStyle;

// Take it from env; "export NODE_ENV=development" in terminal
if (process.env.NODE_ENV === 'production') {
	env = 'production';
} else {
	env = 'development';
}

if (env === 'development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

console.log('GULP: ' + env + ' environment, build folder ' + outputDir);

jsSources = ['client/**/*.js'];
sassSources = ['client/sass/style.scss'];
htmlSources = [outputDir + '**/*.html'];

// Browserify Watchify Setup
var bundler = browserify({
	// Required watchify args
	cache: {},
	packageCache: {},
	entries: ['./client/app.js'],
	debug: env === 'development'
});

var handleErrors = function(e) {
	console.log('Encountered error');
	console.error(e);
};

var bundle = function() {
	return bundler
		.bundle()
		.on('error', handleErrors)
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(outputDir))
		.pipe(buffer())
		.pipe(gulpif(env === 'production', uglify())) // Minify for production, no rename because that would mean manually changing HTML
		.pipe(gulp.dest(outputDir));
};

// GULP TASKS
gulp.task('lint-client', function() {
	return gulp.src('client/app.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('browserify-client', ['lint-client'], function() {
	return bundle();
});

gulp.task('styles', function() {
	return gulp.src(sassSources)
		.pipe(compass({
				sass: 'client/sass',
				css: outputDir,
				image: outputDir + 'images',
				style: sassStyle,
				require: ['susy', 'breakpoint']
			})
			.on('error', gutil.log))
		// .pipe(gulp.dest( outputDir + 'css'))
		.pipe(prefix({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulpif(env === 'production', minifyCSS()));
});

gulp.task('reload', function() {
	return livereload();
});

gulp.task('html', function() {
	gulp.src('client/**/*.html')
		.pipe(gulpif(env === 'production', minifyHTML()))
		.pipe(gulp.dest(outputDir));
});

gulp.task('images', function() {
	gulp.src('client/images/*.*')
		.pipe(gulp.dest(outputDir + 'images'));
});

gulp.task('build', ['browserify-client', 'styles', 'html', 'images']);

gulp.task('default', ['build', 'watch']);

// WATCHING
gulp.task('watch', function() {
	var watchifyBundler = watchify(bundler);
	watchifyBundler.on('update', bundle);
	watchifyBundler.on('log', function(msg) {
		console.log(msg);
	});
	gulp.watch('client/sass/**/*.scss', ['styles', 'reload']);
	gulp.watch(['**/*.html', '**/*.hbs'], ['html', 'reload']);
	gulp.watch(['client/images/*.*'], ['images', 'reload']);

	return bundle();
});
