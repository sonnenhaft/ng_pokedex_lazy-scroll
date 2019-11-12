require('./resources/requireDir.js')('./gulp/tasks');

var port = require('./resources/getPort.js');

var gulp = require('gulp');
var logAndStopServer = require('./gulp/utils/log-and-stop-server');

gulp.task('serve', ['$styl'], function (cb) {
    require('run-sequence')('default', cb);
});

gulp.task('$open', ['$inject-files'], function () {
    gulp.src('index.html').pipe(require('gulp-open')('', {url: 'http://localhost:' + port}));
});

gulp.task('$connect', ['$inject-files'], function () {
    return require('gulp-connect').server({root: './', port: port});
});

gulp.task('default', ['$connect', '$watch', '$watch-index', '$open', '$styl']);

gulp.task('$server', ['$usemin'], function () {
    return require('gulp-connect').server({root: './build', port: port});
});

gulp.task('host', ['$clean-generated'], function (cb) {
    var runSequence = require('run-sequence');
    return runSequence(
        ['$styl', '$ng-templates', '$ng-config'],
        '$server',
        '$clean-temp',
        cb
    );
});

gulp.task('build', function (cb) {
    require('run-sequence')(
        ['$styl', '$ng-templates', '$ng-config'],
        '$usemin',
        '$clean-temp',
        cb
    );
});

gulp.task('safe-build', function (cb) {
    require('run-sequence')('jshint', 'test', 'protractor:jenkins', 'build', cb);
});

gulp.task('deploy', ['build']);// , 'test']);
gulp.task('test', function (done) {
    require('karma').server.start({
        configFile: __dirname + '/resources/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('dev-test', function (done) {
    require('karma').server.start({
        configFile: __dirname + '/resources/karma.conf.js',
        singleRun: false
    }, done);
});

gulp.task('webdriver:update', function (cb) {
    require('gulp-protractor').webdriver_update(null, cb);
});

function protractor() {
    return gulp.src(['./tests/*.e2e.js']).pipe(require('gulp-protractor').protractor({
        configFile: __dirname + '/resources/protractor.config.js',
        args: ['--port=' + port]
    })).on('error', logAndStopServer);
}

gulp.task('protractor:dev', ['webdriver:update'], protractor);

gulp.task('protractor:jenkins', ['webdriver:update', 'host'], function () {
    protractor().on('end', logAndStopServer);
});

gulp.task('jshint', function () {
    var jshintXMLReporter = require('gulp-jshint-xml-file-reporter');
    var jshint = require('gulp-jshint');
    return gulp.src(['./app/**/*.js', './tests/*.js', 'gulpfile.js', 'resources/*.js', 'gulp/**/*.js'])
        .pipe(jshint('./resources/.jshintrc'))
        .pipe(jshint.reporter(require('jshint-stylish')))
        .pipe(jshint.reporter(jshintXMLReporter))
        .on('end', jshintXMLReporter.writeFile({
            format: 'checkstyle',
            filePath: './jshint.xml',
            alwaysReport: true
        }));
});
