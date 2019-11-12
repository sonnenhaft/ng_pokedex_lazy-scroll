var pkg = require('../package.json');

var tempFolder = '.tmp';
var buildFolder = 'build';
var appDir = 'app';

function dashToCamel(s) {
    return s.replace(/-([a-z])/g, function (m, w) {
        return w.toUpperCase();
    });
}

module.exports = {
    ngtemplates: {
        src: [appDir + '/**/*.html', '!' + appDir + '/**/example.html'],
        settings: {
            root: appDir + '/',
            module: pkg.name + '.templates'
        }
    },
    ngconfig: {
        name: pkg.name + '-constant',
        constants: (function (c) {
            c[dashToCamel(pkg.name) + 'Version'] = pkg.version;
            return c;
        })({})
    },
    inject: {
        target: [
            appDir + '/**/_*.js',
            appDir + '/**/*.js',
            appDir + '/**/*.css',
            '!' + appDir + '/**/*spec.js',
            '!' + appDir + '/**/*test-data.js'
        ]
    },

    usemin: {
        fonts: {
            src: appDir + '/**/font/*.*',
            dist: buildFolder + '/css/font/'
        },
        assets: {
            src: [appDir + '/**/*-stub.json', appDir + '/**/*-logo.*', appDir + '/**/*.png'],
            dist: buildFolder + '/'
        },
        injectSrc: [tempFolder + '/templates.js', tempFolder + '/package.js'],
        src: 'index.html',
        dist: buildFolder + '/'
    },

    cleanGeneratedSrc: [
        buildFolder,
        'index.html',
        appDir + '/**/*.{css,map}',
        appDir + '/maps'
    ],
    tempFolderPath: tempFolder,

    watchAssets: [appDir + '/**/*.js', appDir + '/**/*.html', 'index.html'],
    watchIndexSrc: [appDir + '/**/*.{js,css}', 'index-inject.html'],
    appDir: appDir
};
