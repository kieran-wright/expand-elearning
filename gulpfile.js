// simple single SCO package 
var gulp = require('gulp');
var manifest = require('gulp-scorm-manifest');
var zip = require('gulp-zip');


gulp.task('publish', function() {
  gulp.src('course/**')
  .pipe(manifest({
    version: '1.2',
    courseId: 'Expand course',
    SCOtitle: 'Expand module',
    moduleTitle: 'Expand module',
    launchPage: 'index.html',
    fileName: 'imsmanifest.xml'
  }))
  .pipe(gulp.dest('course'))

  .on('end',function(){
  gulp.run('zip');
  })
});

gulp.task('zip', function() {
  return gulp.src('course/**')
  .pipe(zip('scorm.zip'))
  .pipe(gulp.dest('scorm'));
});