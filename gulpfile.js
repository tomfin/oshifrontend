'use strict';


var gulp = require('gulp');
var debug = require('gulp-debug');
var gulpDir = require('require-dir')('./core/gulp');

var plugins = {
    rimraf: require('gulp-rimraf')
};

gulp.task('default', ['clean'], function () {
    console.log('D> Preparing core...', gulpDir);
    return gulp.start('prepareCore', 'prepare', 'build');
});

gulp.task('dev', ['clean'], function () {
    gulp.start('prepareCore', 'prepareDev', 'buildDev');
});

gulp.task('watch', [], function () {
    gulp.watch('app/**', function (file) {
        gulp.start('buildDev');
        console.log('D> Change on: ', file.path);
    });
});

gulp.task('clean', [], function () {
    return gulp.src(['.tmp', 'build', '_project'], { read: false }).pipe(plugins.rimraf());
});
