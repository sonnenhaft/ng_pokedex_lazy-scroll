var gulp    = require('gulp');
var config  = require('../../config');

gulp.task('$inject-files', function () {
    var inject  = require('gulp-inject');
    var rename  = require('gulp-rename');

    return gulp.src('index-inject.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'))
        .pipe(inject(gulp.src(config.inject.target, {read: false}), {
            relative: true
        })).pipe(gulp.dest('./'));
});