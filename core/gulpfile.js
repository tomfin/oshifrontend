'use strict';

var gulp = require('gulp'),
	fs = require('fs'),
    requireDir = require('require-dir');

var coreDir = 'core';
var coreDetect = (function (){
        return !!fs.readdirSync('./')
                .filter(function (file){
                    return file == coreDir;
                })
                .length;
    })();

var tasksDir = coreDetect ? './'.concat(coreDir,'/gulp') : './gulp';
requireDir(tasksDir);

gulp.task('default', ['build:start']);

gulp.task('build:start', ['clean'], function () {
    return gulp.start('build');
});

