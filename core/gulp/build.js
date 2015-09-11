'use strict';
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    pattern: ['*'],
    lazy: false
});

var DEV_MODE = !!plugins.util.env.dev;

var everywhere = '_project/app/**/**/**/*',
    bower_components = 'bower_components/**/**/**/*',
    expressRoot = plugins.path.resolve('./.tmp'),
    publicDir = plugins.path.resolve('./build'),
    source = require('vinyl-source-stream');

function clean(relativePath, callback) {
    plugins.util.log('Cleaning: ' + plugins.util.colors.blue(relativePath));
    plugins.del.sync([(publicDir + relativePath), (expressRoot + relativePath)]);
}

function templates(callback) {
    clean('/js/templates*.js');
    plugins.util.log('Rebuilding application templates');

    gulp.src(everywhere + '.html')
        .pipe(plugins.angularTemplatecache({
            root:   '/app/',
            module: 'casino'
        }))
        .pipe(plugins.streamify(plugins.rev()))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(plugins.duration('application templates'))
        .pipe(gulp.dest(expressRoot + '/html'))
        .pipe(gulp.dest(publicDir + '/js'))
        .pipe(plugins.gzip())
        .pipe(gulp.dest(publicDir + '/js'))
        .on('end', callback || function() {})
        .on('error', plugins.util.log);
}

function scripts(callback) {
    clean('/js/app*.js');
    plugins.util.log('Rebuilding application js');

    gulp.src([everywhere + '*.js'])
        .pipe(DEV_MODE ? plugins.sourcemaps.init() : plugins.util.noop())
        .pipe(plugins.concat('app.js'))
        .pipe(!DEV_MODE ? plugins.ngAnnotate() : plugins.util.noop())
        //.pipe(!DEV_MODE ? plugins.stripComments() : plugins.util.noop())
        .pipe(!DEV_MODE ? plugins.uglify() : plugins.util.noop())
        .pipe(plugins.streamify(plugins.rev()))
        .pipe(DEV_MODE ? plugins.sourcemaps.write() : plugins.util.noop())
        .pipe(plugins.duration('rebuilding files app js'))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(gulp.dest(expressRoot + '/js'))
        .pipe(gulp.dest(publicDir + '/js'))
        .pipe(plugins.gzip())
        .pipe(gulp.dest(publicDir + '/js'))
        .on('end', callback || function() {})
        .on('error', plugins.util.log);
}

function libs(callback) {
    clean('/js/lib*.js');
    plugins.util.log('Rebuilding application lib');

    gulp.src(plugins.mainBowerFiles({
        filter: '**/*.js'
    }))
        .pipe(DEV_MODE ? plugins.sourcemaps.init() : plugins.util.noop())
        .pipe(plugins.concat('lib.js'))
        .pipe(!DEV_MODE ? plugins.uglify() : plugins.util.noop())
        .pipe(DEV_MODE ? plugins.sourcemaps.write() : plugins.util.noop())
        .pipe(plugins.streamify(plugins.rev()))
        .pipe(plugins.size({ showFiles: true }))
        .pipe(plugins.duration('rebuilding files lib js'))
        .pipe(gulp.dest(publicDir + '/js'))
        .pipe(plugins.gzip())
        .pipe(gulp.dest(publicDir + '/js'))
        .on('end', callback || function() {})
        .on('error', plugins.util.log);
}

function styles(callback) {
    clean('/resources/css/app*.css');
    plugins.util.log('Rebuilding application styles');

    var cssFiles = plugins.mainBowerFiles({
        filter: '**/*.css'
    });

    cssFiles.push('_project/app/**/*.css');
    cssFiles.push('_project/app/**/*.scss');
    cssFiles.push('!_project/app/**/_*.scss');

    gulp.src(cssFiles)
        .pipe(DEV_MODE ? plugins.sourcemaps.init() : plugins.util.noop())
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.concat('app.css'))
        .pipe(!DEV_MODE ? plugins.minifyCss() : plugins.util.noop())
        .pipe(plugins.streamify(plugins.rev()))
        .pipe(DEV_MODE ? plugins.sourcemaps.write() : plugins.util.noop())
        .pipe(plugins.size({ showFiles: true }))
        .pipe(plugins.duration('rebuilding files style'))
        .pipe(gulp.dest(publicDir + '/css'))
        .pipe(plugins.gzip())
        .pipe(gulp.dest(publicDir + '/css'))
        .on('end', callback || function() {})
        .on('error', plugins.util.log);
}

function fonts(callback) {
    plugins.util.log('Rebuilding application fonts');

    var font_files = plugins.mainBowerFiles({
        filter: '**/fonts/*'
    });

    font_files.push('_project/app/resources/fonts/**');

    gulp.src(font_files)
        .pipe(gulp.dest(publicDir + '/fonts'))
        .on('end', callback || function() {})
        .on('error', plugins.util.log);
}

function bower(callback) {
    if (DEV_MODE) {
        callback();
        return;
    }

    clean('/resources/js/lib*.css');
    plugins.util.log('Rebuilding bower');

    plugins.bower({ cmd: 'update'}, '-F')
        .pipe(plugins.duration("bower files"))
        .pipe(gulp.dest(expressRoot + '/lib'))
        .on('end', callback || function() {})
        .on('error', plugins.util.log);
}

function i18n(callback) {
    plugins.util.log('Copying i18n files');

    return gulp.src('_project/i18n/*.json')
        .pipe(gulp.dest(publicDir + '/i18n'))
        .on('end', callback || function() {})
        .on('error', plugins.util.log);
}

function images(callback) {
    plugins.util.log('Copying images');

    gulp.src(['_project/app/resources/**', '!_project/app/resources/**css', '!_project/app/resources/css/**'])
        .pipe(gulp.dest(publicDir + '/resources'))
        .on('end', callback || function() {})
        .on('error', plugins.util.log);
}

function indexHtml(cb) {
    plugins.util.log('Rebuilding index.html');

    function inject(glob, path, tag) {
        return plugins.inject(
            gulp.src(glob, {
                cwd: path
            }), {
                starttag: '<!-- inject:' + tag + ':{{ext}} -->'
            }
        );
    }

    function buildIndex(path, callback) {
        gulp.src('_project/app/index.html')
            .pipe(inject('./css/app*.css', path, 'app-style'))
            .pipe(inject('./js/app*.js', path, 'app'))
            .pipe(inject('./js/templates*.js', path, 'templates'))
            .pipe(inject('./js/lib*.js', path, 'lib'))
            .pipe(gulp.dest(path))
            .on('end', callback || function() {})
            .on('error', plugins.util.log);
    }

    buildIndex(publicDir, cb || function(){});
}

function clearTmpDir(cb) {
    if (DEV_MODE) {
        cb();
        return;
    }

    console.log ("Start clearTmpDir");
    plugins.del.sync(['.tmp', '_project']);
    console.log ("Finish clearTmpDir");
    cb();
}

gulp.task('plugins', function (){
   console.log (Object.keys(plugins));
});

gulp.task('build', ['prepare'], function (done) {
        plugins.async.series([
                bower,
                function (callback){
                    plugins.async.parallel([
                        fonts,
                        i18n,
                        images,
                        styles
                    ],callback);
                },
                function (callback){
                    plugins.async.parallel([
                        libs,
                        templates,
                        scripts
                    ],callback);
                },
                indexHtml,
                clearTmpDir
            ], function (){
        done();
    })
});

var express = require('express'),
    refresh = require('gulp-livereload'),
    livereload = require('connect-livereload'),
    bodyParser = require('body-parser'),
    opener = require('opener'),
    livereloadport = 35729,
    serverport = 8080;

var server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(livereload({port: livereloadport}));

server.use(express.static('build/'));
server.use(['/assets','/css','/fonts','/i18n','/js'], function(req, res, next){
    if (!plugins.fs.existsSync(plugins.path.join(__dirname + '../build',req.url)) || req.url == "/favicon.ico") {
        res.status(404).send('');
    } else {
        res.sendFile('index.html', { root: 'build/' });
    }
});
server.all('/*', function(req, res) {
    res.sendFile('index.html', { root: 'build/' });
});

gulp.task('watch', ['build'], function () {
    gulp.start('site:open');

    plugins.watch(['app/**', 'core/**'],
        plugins.batch(function (events, done) {
            gulp.start('build', function (){
                refresh.changed();
                done();
            });
        })
    );
});

gulp.task('server:start', [], function (){
    server.listen(serverport);
    refresh.listen(livereloadport);
});

gulp.task('site:open', ['server:start'], function (){
    opener("http://127.0.0.1:8080");
});

gulp.task('clean', [], function () {
    return plugins.del.sync(['build/*']);
});


