'use strict';
var gulp = require('gulp'),
    plugins = {
        util: require('gulp-util'),
        debug: require('gulp-debug')
    },
    expressRoot = require('path').resolve('./_project');


gulp.task('prepareCore', ['copyCoreApp', 'copyCorei18n', 'copyCoreTest']);

gulp.task('copyCoreApp', ['clean'], function () {
    return gulp.src(['./core/app/**', '!./core/app/resources/theme/**/*'])
        .pipe(gulp.dest(expressRoot + '/app'));
});

gulp.task('copyCorei18n', ['clean'], function () {
    return gulp.src('./core/i18n/**')
        .pipe(gulp.dest(expressRoot + '/i18n'));
});

gulp.task('copyCoreTest', [], function () {
    return gulp.src('./core/test/**')
        .pipe(gulp.dest(expressRoot + '/test'));
});
