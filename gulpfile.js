// Gulp Dependencies
var gulp = require('gulp');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var compass = require('gulp-compass');
var minifyHTML = require('gulp-minify-html');

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

// Test Dependencies
var mochaPhantomjs = require('gulp-mocha-phantomjs');

var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle;

env = 'development';

if (env==='development') {
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}

jsSources = ['client/**/*.js'];
sassSources = ['client/sass/style.scss'];
htmlSources = [outputDir + '**/*.html'];

// Browserify Watchify Setup
var bundler = browserify({
	// Required watchify args
	cache: {},
	packageCache: {},
	entries: ['./client/app.js'],
	debug: true
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
		.pipe(gulp.dest(outputDir));
};

// GULP TASKS
gulp.task('lint-client', function() {
	return gulp.src('client/app.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('lint-test', function() {
	return gulp.src('./test/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('browserify-client', ['lint-client'], function() {
	return bundle();
});

gulp.task('browserify-test', ['lint-test'], function() {
	return bundler
		.bundle()
		.on('error', handleErrors)
		.pipe(source('test-bundle.js'))
		.pipe(gulp.dest('build'));
});

gulp.task('test', ['lint-test', 'browserify-test'], function() {
	return gulp.src('test/client/index.html')
		.pipe(mochaPhantomjs());
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
			cascade: true
		}));
});

gulp.task('minify-css', ['styles'], function() {
	return gulp.src(outputDir + 'style.css')
		.pipe(minifyCSS())
		.pipe(rename('style.min.css'));
});

gulp.task('uglify-js', ['browserify-client'], function() {
	return gulp.src(outputDir + 'bundle.js')
		.pipe(uglify())
		.pipe(rename('bundle.min.js'));
});

gulp.task('reload', function(){
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

gulp.task('build', ['uglify-js', 'minify-css', 'html', 'images']);

gulp.task('default', ['build', 'watch']);
// gulp.task('default', ['test', 'build', 'watch']);

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

	// NODE
	// listen for changes
	// livereload.listen();
	// // configure nodemon
	// nodemon({
	// 		// the script to run the app
	// 		script: 'server.js',
	// 		ext: 'js'
	// 	})
	// 	.on('restart', function() {
	// 		// when the app has restarted, run livereload.
	// 		gulp.src('server.js')
	// 			.pipe(livereload())
	// 			.pipe(notify('Reloading page, please wait...'));
	// 	});

	return bundle();
});
