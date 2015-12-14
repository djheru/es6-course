var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var traceur = require('gulp-traceur');
var concat = require('gulp-concat');

gulp.task('default', function () {
  return gulp.src([traceur.RUNTIME_PATH, 'src/*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(traceur({
      experimental: true
    }))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('traceur:runtime', function() {
  return gulp.src(traceur.RUNTIME_PATH)
    .pipe(gulp.dest('./dist'));
});
gulp.task('build:dist', ['traceur:runtime'], function() {
  return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(traceur({
      experimental: true
    }))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});
