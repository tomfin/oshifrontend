'use strict';
var gulp = require('gulp'),
    lib = require('./lib.js'),
    plugins = {
        util: require('gulp-util'),
        es: require('event-stream'),
        path: require('path'),
        fs: require('fs')
    },
    expressRoot = require('path').resolve('./_project');

gulp.task('prepareDev', ['copyDevApp', 'copyDevi18n'], function () {});

gulp.task('copyDevApp', [], function () {
    return gulp.src('./app/**')
        .pipe(gulp.dest(expressRoot + '/app'));
});

gulp.task('copyDevi18n', [], function () {

    return gulp.src('./i18n/*.json')
        .pipe(plugins.es.mapSync(function (data) {

            var expressDirI18n = plugins.path.join(expressRoot,"/i18n"),
                filename = plugins.path.basename(data.path),
                coreLangFile = plugins.path.join(expressDirI18n,filename);


            var langFileData = JSON.parse(data.contents.toString());

            if (plugins.fs.existsSync(coreLangFile)) {
                var langCoreFileData = lib.loadJSONfile(coreLangFile, 'utf8');
                langFileData = lib.MergeRecursive(langCoreFileData, langFileData);
            }

            if (!plugins.fs.existsSync(expressDirI18n))
                plugins.fs.mkdirSync(expressDirI18n);

            plugins.fs.writeFileSync(plugins.path.join(expressDirI18n, filename), JSON.stringify(langFileData, null, '\t'), {encoding: 'utf8'});

        }));
});

gulp.task('copyDevTest', [], function () {
    return gulp.src('./test/**')
        .pipe(gulp.dest(expressRoot + '/test'));
});
