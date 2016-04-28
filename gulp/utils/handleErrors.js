module.exports = function() {
    var args = Array.prototype.slice.call(arguments);
    // Send error to notification center with gulp-notify
    require('gulp-notify').onError({
        title: 'Compile Error',
        message: '<%= error %>'
    }).apply(this, args);
    // Keep gulp from hanging on this task
    this.emit('end');
};