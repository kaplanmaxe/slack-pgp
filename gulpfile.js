const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('transpile-core', () => {
  return gulp.src(['src/*.js'])
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest('./lib/'));
});

gulp.task('babel-core', () => {
  return gulp.watch(['src/*.js'], ['transpile-core']);
});

gulp.task('default', [
  'transpile-core',
  'babel-core'
]);
