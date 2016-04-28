var gulp = require('gulp');
var config = require('../../config');
var compileStyl = require('../../utils/compile-styl-fn');

gulp.task('$styl', function () {
    return compileStyl(config.appDir + '/**/*.styl', config.appDir);
});