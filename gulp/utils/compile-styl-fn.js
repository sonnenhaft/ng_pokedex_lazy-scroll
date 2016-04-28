var gulp = require('gulp');
var handleErrors = require('./handleErrors');

module.exports = function(src, dest) {
    var stylus = require('gulp-stylus');
    var autoprefixer = require('gulp-autoprefixer');

    return gulp.src(src)
        //.pipe(sourcemaps.init())
        .pipe(stylus())
        .on('error', handleErrors)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        //.pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dest));
};
