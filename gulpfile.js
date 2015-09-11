'use strict';

var gulp = require('gulp');
var debug = require('gulp-debug');
require('require-dir')('./core/gulp');

var plugins = {
    rimraf: require('gulp-rimraf')
};

gulp.task('default', ['clean'], function () {
    return gulp.start('prepareCore', 'prepare', 'build');
});

gulp.task('dev', ['clean'], function () {
    gulp.start('prepare', 'build-dev')
});

gulp.task('watch', [], function () {
    gulp.watch('app/**', function () {
        gulp.start('dev')
    });
});

gulp.task('clean', [], function () {
    return gulp.src(['.tmp', 'build', '_project'], { read: false }).pipe(plugins.rimraf());
});