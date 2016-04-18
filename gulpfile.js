var gulp = require('gulp')

// Grab gulp plugins
var p = require('gulp-load-plugins')()
p.argv = require('yargs').argv
p.autoprefixer = require('autoprefixer')
p.lost = require('lost')
p.cssnano = require('cssnano')

// Pull in some settings
var s = require('./settings.js')

// ----------------------------------------------------------------------------
// Stylesheets

gulp.task('styles', function () {
  return gulp.src(s.paths.src + '/style/style.css')
    .pipe(p.if(!p.argv.production, p.sourcemaps.init()))
    .pipe(p.postcss([
      p.lost(),
      p.autoprefixer(),
      p.cssnano()
    ]))
    .pipe(p.if(!p.argv.production, p.sourcemaps.write()))
    .pipe(gulp.dest(s.paths.static + '/css'))
})

// ----------------------------------------------------------------------------
// Scripts (Browserify)
p.browserify = require('browserify')
p.watchify = require('watchify')
p.babelify = require('babelify')
p.source = require('vinyl-source-stream')
p.buffer = require('vinyl-buffer')
p.merge = require('utils-merge')

var bundlejs = function (bundler) {
  return bundler.bundle()
    .on('error', p.util.log.bind(p.util, 'Browserify Error'))
    .pipe(p.source(s.paths.src + '/script/script.js'))
    .pipe(p.buffer())
    // .pipe(rename(s.theme + '.js'))
    // .pipe(gulp.dest(s.dest + 'js'))
    .pipe(p.rename('application.js'))
    .pipe(p.if(!p.argv.production, p.sourcemaps.init({loadMaps: true})))
    .pipe(p.if(p.argv.production, p.uglify()))
    .pipe(p.if(!p.argv.production, p.sourcemaps.write('.', {sourceRoot: '../../..'})))
    .pipe(gulp.dest(s.paths.static + './js'))
}

gulp.task('browserify', function () {
  var args = p.merge(p.watchify.args, { debug: true })
  var bundler = p.watchify(
    p.browserify(s.paths.src + '/script/script.js', args))
    .transform(p.babelify, {
      presets: ['es2015']
    })
  bundlejs(bundler)
  bundler.on('update', function () {
    bundlejs(bundler)
  })
})

// ----------------------------------------------------------------------------
// Watch & Serve

gulp.task('watch', function () {
  gulp.watch(s.paths.src + '**/*.css', ['styles'])
})
