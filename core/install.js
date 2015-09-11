"use strict";

(function () {
    var sys = require('sys'),
        exec = require('child_process').exec,
        fs = require('fs'),
        path = require('path'),
        options = parseArgs(process.argv),
        appDirectory = options['path'] || './casino-frontend',
        queue = [];

    function add(functions) {
        Array.prototype.push.apply(queue, arguments);
    }

    function next() {
        if (queue.length) {
            queue.shift()();
        }
    }

    function puts(error, stdout, stderr) {
        if (error) {
            console.error(error);
        } else {
            console.log(stdout);
            console.log(stderr);
            next();
        }
    }

    function parseArgs(args) {
        return args.slice(2).reduce(function (memo, arg) {
            if (/^--/.test(arg)) {
                memo['__lastKey'] = arg.replace(/^--/, '');
            } else {
                memo[memo['__lastKey']] = arg;
                delete memo['__lastKey'];
            }
            return memo;
        }, {});
    }

    function copyFile(s, d) {
        fs.writeFileSync(d, fs.readFileSync(s));
    }

    var makeStructure = function () {
            var command = process.platform == 'win32' ? 'mkdir' : 'mkdir -p';

            add(function () {
                console.log('Making file structure.');
                exec(command + " " + path.join(appDirectory, 'app', 'resources', 'css'), puts);
            }, function () {
                process.chdir(appDirectory);
                next();
            });
        },
        makeLocalGit = function () {
            add(function () {
                console.log('Making local git.');
                exec("git init", puts);
            });
        },
        makeGitSubmodule = function () {
            add(function () {
                console.log('Making git submodule: core.');
                exec("git submodule add http://gitpub.softswiss.com/pub/frontend.git core", puts);
            });
        },
        copyFiles = function () {
            add(function () {
                console.log('Copying files from core.');

                copyFile('./core/package.json', 'package.json');
                copyFile('./core/.gitignore', '.gitignore');
                copyFile('./core/gulpfile.js', 'gulpfile.js');
                copyFile('./core/bower.json', 'bower.json');
                copyFile('./core/server.js', 'server.js');
                copyFile('./core/app/config.js', './app/config.js');
                copyFile('./core/app/resources/css/main.css', './app/resources/css/main.css');

                next();
            });
        },
        start = function () {
            add(function () {
                    console.log('Install npm packages it can take a few minutes.');
                    exec("npm install", puts);
                }
                , function () {
                    console.log('Install bower components it can take a few minutes.');
                    exec("bower install", puts);
                }
                , function () {
                    console.log('Build app.');
                    exec("gulp", puts);
                },
                function () {
                    console.log('Start local server.');
                    exec("npm start", puts);
                }, function () {
                    console.log('Finished. Check you browser.');
                });
        };

    console.log('SoftSwiss frontend installation is started');

    makeStructure();

    makeLocalGit();
    makeGitSubmodule();
    copyFiles();
    start();

    next();
})
();
