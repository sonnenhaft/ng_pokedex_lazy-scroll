var gulp    = require('gulp');
var config  = require('../../config');

gulp.task('$clean-generated', function () {
    var clean   = require('gulp-clean');

    return gulp.src(config.cleanGeneratedSrc).pipe(clean());
});