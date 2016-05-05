var gulp = require('gulp'),
  gutil = require('gulp-util'),
  jade = require('gulp-jade'),
  inject = require('gulp-inject'),
  bowerFiles = require('main-bower-files'),
  sass = require('gulp-sass'),
  del = require('del')

gulp.task('vendor', function() {
  gulp.src(bowerFiles())
  .pipe(gulp.dest('vendor/'));
});

gulp.task('injects', function () {
  var bfiles = []
  bowerFiles().forEach(function(file){
    bfiles.push('vendor/' + file.match(/\/([\w,\-,\_]+\.(min.)?(?:js|css|jquery.js))/)[1])
  });
  var target = gulp.src('app/index.jade'),
    sources = gulp.src(['app/**/*.js','app/**/*.css'], {read: false});
  return target.pipe(inject(sources, {relative: true}))
    .pipe(inject(gulp.src(bfiles, {read: false}), {name: 'bower', relative: true}))
    .pipe(gulp.dest('app/'));
});

gulp.task('sass', function() {
  gulp.src('app/styles/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('app/styles'))
});

gulp.task('jade', ['injects'], function () {
  gulp.src('app/**/*.jade')
  .pipe(jade().on('error', gutil.log))
  .pipe(gulp.dest('app/'));
});

gulp.task('default',['injects', 'jade'], function() {
  gulp.watch('app/**/*.js', function(e){
    if(['added','deleted'].indexOf(e.type) !== -1){
    gulp.start('injects')
    }
  })
  gulp.watch('app/**/*.jade', ['jade']);
  gulp.watch('app/**/*.scss', ['sass','injects']);
})

//
// gulp.task('prod', function() {
//   gulp.src('dist')
//     .pipe(webserver({
//       host: '0.0.0.0',
//       port: process.env.PORT || 80,
//       livereload: false,
//       directoryListing: false,
//       open: true
//   }));
// });


// gulp.task('clean', function(){
//   return del(['dist/*','!dist/package.json', '!dist/node_modules']);
// });
//
// gulp.task('images', function(){
//   gulp.src('app/images/**/*')
//   .pipe(gulp.dest('dist/images'))
// });
//
// gulp.task('fonts', function(){
//   gulp.src('app/fonts/**/*')
//   .pipe(gulp.dest('dist/fonts'))
// });
//
// gulp.task('coffee', function() {
//   gulp.src('app/**/*.coffee')
//     .pipe(coffee({bare: true}).on('error', gutil.log))
//     .pipe(gulp.dest('dist/'))
// });
// gulp.task('js', function() {
//   gulp.src('app/**/*.js')
//   .pipe(gulp.dest('dist/'))
// });
//
// gulp.task('css', function() {
//   gulp.src('app/styles/**/*.css')
//   .pipe(gulp.dest('dist/styles/'))
// });
//



// gulp.task('manual_vendor',function(){
//   gulp.src('app/vendor/*')
//   .pipe(gulp.dest('dist/vendor/'));
// });
