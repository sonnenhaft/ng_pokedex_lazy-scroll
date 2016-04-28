var FS = require('fs');
var Path = require('path');

module.exports = function requireDir(name) {
    var dir = Path.resolve(name);
    FS.readdirSync(dir).forEach(function (file) {
        var path = Path.resolve(dir, file);
        if (FS.statSync(path).isDirectory()) {
            requireDir(path);
        } else {
            require(path);
        }
    });
};