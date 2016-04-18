var gulp = require('gulp')

// Grab gulp plugins
var p = require('gulp-load-plugins')()
p.autoprefixer = require('autoprefixer')
p.lost = require('lost')

// Pull in some settings
var s = require('./settings.js')

gulp.task('styles', function () {
  return gulp.src(s.paths.src + '/style/style.css')
    .pipe(p.sourcemaps.init())
    .pipe(p.postcss([
      p.lost(),
      p.autoprefixer()
    ]))
    .pipe(p.sourcemaps.write())
    .pipe(gulp.dest(s.paths.static + '/css'))
})

gulp.watch(s.paths.src + '**/*.css', ['styles'])
