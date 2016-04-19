var gulp = require('gulp')

// ----------------------------------------------------------------------------
// Plugins
var p = require('gulp-load-plugins')()
p.browserSync = require('browser-sync')
p.argv = require('yargs').argv
// CSS
p.autoprefixer = require('autoprefixer')
p.lost = require('lost')
p.easyimport = require('postcss-easy-import')
p.cssnext = require('postcss-cssnext')
p.cssnano = require('cssnano')
// JS (browserify)
p.browserify = require('browserify')
p.watchify = require('watchify')
p.babelify = require('babelify')
p.source = require('vinyl-source-stream')
p.buffer = require('vinyl-buffer')
p.merge = require('utils-merge')

// ----------------------------------------------------------------------------
// Settings
var s = require('./settings.js')

function plumberError (error) {
  // Output an error message
  p.util.log(p.util.colors.red('Error (' + error.plugin + '): ' + error.message))
  // emit the end event, to properly end the task
  this.emit('end')
}

// ----------------------------------------------------------------------------
// Stylesheets
gulp.task('styles', function () {
  return gulp.src(s.paths.src + '/style/style.scss')
    .pipe(p.plumber(plumberError))
    .pipe(p.if(!p.argv.production, p.sourcemaps.init()))
    .pipe(p.sass())
    .pipe(p.postcss([
      p.lost(),
      p.cssnano()
    ]))
    .pipe(p.plumber.stop())
    .pipe(p.if(!p.argv.production, p.sourcemaps.write()))
    .pipe(gulp.dest(s.paths.static + '/css'))
    .pipe(p.browserSync.stream())
})

// ----------------------------------------------------------------------------
// Scripts (Browserify)
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

gulp.task('browser-sync', function () {
  p.browserSync.init({
    proxy: 'localhost:' + s.port,
    ghostMode: false,
    open: false
  })
})

gulp.task('bs-reload', function () {
  p.browserSync.reload
})

gulp.task('runKeystone', p.shell.task('PORT=' + s.port + ' nodemon keystone.js --debug --ignore source --ignore public'))
gulp.task('watch', [
  'browserify',
  'browser-sync'
], function () {
  gulp.watch(s.paths.src + '/style/**/*.scss', ['styles'])
})

gulp.task('default', ['watch', 'runKeystone'])
