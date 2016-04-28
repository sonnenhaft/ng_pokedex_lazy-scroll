var port = 4000;
process.argv.filter(function (val) {
    return val.indexOf('--port') !== -1;
}).forEach(function (p) {
    var newPort = p.split('=')[1] - 0;
    port = isNaN(newPort) || !newPort ? port : newPort;
});
module.exports = port;
