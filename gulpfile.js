// simple single SCO package 
var gulp = require('gulp');
var manifest = require('gulp-scorm-manifest');
 
gulp.task('publish', function() {
    gulp.src('course/**')
    .pipe(manifest({
      version: '1.2',
      courseId: 'Test course',
      SCOtitle: 'Test module',
      moduleTitle: 'Test module',
      launchPage: 'index.html',
      fileName: 'imsmanifest.xml'
    }))
    .pipe(gulp.dest('course'))
});