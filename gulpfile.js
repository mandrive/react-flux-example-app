var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var streamify   = require('gulp-streamify');
var envify = require('envify/custom');

var scriptsDir = './js/src/';
var distDir = './js/dist/';

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {

  var props = {
    entries: [scriptsDir + file],
    debug : true,
    transform:  [reactify]
  };

  // watchify() if watch requested, otherwise run browserify() once
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(streamify(uglify()))
      .pipe(gulp.dest(distDir));
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

function buildDevScript(file, watch) {

  var props = {
    entries: [scriptsDir + file],
    debug : true,
    transform:  [['envify', {'global': true, '_': 'purge', NODE_ENV: 'development'}], reactify]
  };

  // watchify() if watch requested, otherwise run browserify() once
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest(distDir));
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();
}

gulp.task('build', function() {
  return buildScript('app.js', false);
});

gulp.task('dev-build', function() {
  return buildDevScript('app.js', false);
});

gulp.task('uglify', function() {
  return gulp.src(buildDir + 'app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest(scriptsDir));
});

gulp.task('default', ['dev-build'], function() {
  return buildDevScript('app.js', true);
});

gulp.task('release', ['build'], function() {
  return buildScript('app.js', true);
});
