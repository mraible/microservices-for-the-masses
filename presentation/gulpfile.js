'use strict';

var pkg = require('./package.json'),
  autoprefixer = require('gulp-autoprefixer'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  connect = require('gulp-connect'),
  csso = require('gulp-csso'),
  del = require('del'),
  exec = require('gulp-exec'),
  ghpages = require('gh-pages'),
  git = require('git-rev-sync'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  path = require('path'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream'),
  stylus = require('gulp-stylus'),
  through = require('through'),
  uglify = require('gulp-uglify'),
  isDist = process.argv.indexOf('serve') === -1,
  // browserifyPlumber fills the role of plumber() when working with browserify
  browserifyPlumber = function(e) {
    if (isDist) throw e;
    gutil.log(e.stack);
    this.emit('end');
  };

gulp.task('js', ['clean:js'], function() {
  // see https://wehavefaces.net/gulp-browserify-the-gulp-y-way-bb359b3f9623
  return browserify('src/scripts/main.js').bundle()
    .on('error', browserifyPlumber)
    .pipe(source('src/scripts/main.js'))
    .pipe(buffer())
    .pipe(isDist ? uglify() : through())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('static', function() {
  return gulp.src(['src/*.html','src/styles/onstage.css','src/fonts'])
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('html', ['clean:html', 'static'], function() {
  return gulp.src('src/index.adoc')
    .pipe(isDist ? through() : plumber())
    .pipe(exec('bundle exec asciidoctor-bespoke -o - src/index.adoc', { pipeStdout: true }))
    .pipe(exec.reporter({ stdout: false }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('css', ['clean:css'], function() {
  return gulp.src('src/styles/main.styl')
    .pipe(isDist ? through() : plumber())
    .pipe(stylus({ 'include css': true, paths: ['./node_modules'] }))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest('dist/build'))
    .pipe(connect.reload());
});

gulp.task('fonts', ['clean:fonts'], function() {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(connect.reload());
});

gulp.task('images', ['clean:images'], function() {
  return gulp.src('src/images/*.{gif,jpg,png,svg}')
    .pipe(gulp.dest('dist/images'))
    .pipe(connect.reload());
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clean:html', function() {
  return del('dist/index.html');
});

gulp.task('clean:js', function() {
  return del('dist/build/build.js');
});

gulp.task('clean:css', function() {
  return del('dist/build/build.css');
});

gulp.task('clean:fonts', function() {
  return del('dist/fonts');
});

gulp.task('clean:images', function() {
  return del('dist/images');
});

gulp.task('connect', ['build'], function() {
  connect.server({ root: 'dist', port: 2000, livereload: true });
});

gulp.task('watch', function() {
  gulp.watch('src/**/onstage.*', ['static']);
  gulp.watch('src/**/*.adoc', ['html']);
  gulp.watch('src/scripts/**/*.js', ['js']);
  gulp.watch('src/styles/**/*.styl', ['css']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/fonts/*', ['fonts']);
});

gulp.task('build-branch', ['build'], function() {
  var branch = git.branch();
  if (branch != 'master') {
    return gulp.src('dist/**/*')
      .pipe(gulp.dest('dist/@' + branch));
  }
});

gulp.task('publish', ['clean', 'build-branch'], function(done) {
  var branch = git.branch();
  var opts = { logger: gutil.log };
  if (branch != 'master') {
    opts.src = (opts.only = '@' + branch) + '/**/*';
  }
  else {
    // only is a list of globby expressions (not git pathspecs)
    opts.only = ['*', '!@*']
  }
  ghpages.publish(path.join(__dirname, 'dist'), opts, done);
});

// old alias for publishing on gh-pages
gulp.task('deploy', ['publish']);

gulp.task('build', ['js', 'html', 'css', 'fonts', 'images']);

gulp.task('serve', ['connect', 'watch']);

gulp.task('default', ['build']);
