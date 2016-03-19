var gulp   = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('copy', function(cb) {
  return gulp.src(['chrome-extension/manifest.json', 'chrome-extension/**/*.png'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('uglify', function(cb) {
  return gulp.src(['chrome-extension/js/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('dist', ['copy', 'uglify']);