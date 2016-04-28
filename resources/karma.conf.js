module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        autoWatch: true,
        usePolling: true,
        'atomic_save': false,
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-ui-scroll/dist/ui-scroll.js',
            'bower_components/angular-ui-scroll/dist/ui-scroll-jqlite.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'resources/directive-builder.js',
            'app/**/_*.js',
            'app/**/*.html',
            'app/**/*.js',
            'app/*.js'
        ],
        plugins: [
            'karma-ng-html2js-preprocessor',
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-junit-reporter'
        ],
        preprocessors: {
            '{app,app/**/**}/!(*data|*spec)+(.js)': ['coverage'],
            'app/**/*.html': ['ng-html2js']
        },
        ngHtml2JsPreprocessor: {moduleName: 'ngMock'},
        reporters: ['progress', 'coverage', 'junit'],
        coverageReporter: {
            subdir: function(browser) {
                return browser.split(' ').join('_');
            },
            reporters: [
                {dir: 'coverage', type: 'html'},
                {dir: 'coverage', type: 'cobertura', file: 'coverage.xml'}
            ]
        },
        junitReporter: {
            outputDir: 'coverage', // results will be saved as $outputDir/$browserName.xml
            outputFile: 'junit.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
            suite: 'Unit tests', // suite will become the package name attribute in xml testsuite element
            useBrowserName: true // add browser name to report and classes names
        },
        reportSlowerThan: 180,
        logLevel: config.LOG_INFO // for debug use config.LOG_DEBUG
    });
};
