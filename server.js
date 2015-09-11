var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    bodyParser = require('body-parser'),
    util = require('util'),
    opener = require('opener'),
    fs = require('fs'),
    path = require('path'),
    colors = require('colors'),
    argv = require('optimist').argv,
    configFileName = 'server.json';

if (argv.h || argv.help) {
    console.log([
        "usage: node server.js [path] [options]",
        "",
        "[path]               Server root path [build/]",
        "",
        "options:",
        "",
        "  -p                 Port to use [8080]",
        "  -a                 Address to use [127.0.0.1]",
        "  -r                 Angular index file [index.html]",
        "  -o                 Open browser window after staring the server",
        "  -si --silent       Suppress log messages from output",
        "  -h --help          Print this list and exit.",
        "",
        "You can config server by server.json under project root",
        "Command line options override the settings in the file",
        "",
        "Example server.json",
        "{                              ",
        "    'port': '8080',            ",
        "    'address': '127.0.0.1',    ",
        "    'root': 'build/',          ",
        "    'route': 'index.html',     ",
        "    'open': false,             ",
        "    'silent': false            ",
        "}"
    ].join('\n'));
    process.exit();
}

var fileConfig = path.join(__dirname, configFileName);
if (fs.existsSync(fileConfig)) {
    fileConfig = require(fileConfig);
}

var options = {
    port : fileConfig.port || argv.p || '8080',
    address : fileConfig.address || argv.a || '127.0.0.1',
    root: fileConfig.root || argv._[0] || 'build/',
    route: fileConfig.route || argv.r || 'index.html'
};

options.root = __dirname + "/" + options.root;

var log = (argv.si || argv.silent || fileConfig.silent) ? (function () {}) : console.log;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    log('[%s] "%s %s" "%s"', (new Date).toUTCString(), req.method.cyan, req.url.cyan, req.headers['user-agent']);
    next();
});

app.use(express.static(options.root));

app.use(['/assets','/css','/fonts','/i18n','/js'], function(req, res, next){
    if (!fs.existsSync(path.join(options.root,req.url)) || req.url == "/favicon.ico") {
        res.status(404).send('');
    } else {
        res.sendFile(options.route, {root: options.root});
    }
});


app.use('/*', function(req, res, next){
    res.sendFile(options.route, {root: options.root});
});

var uri = ['http', '://', options.address, ':', options.port].join('');
server.listen(options.port, options.address, function() {
    log('Starting server '.yellow
    + options.root.cyan
    + ' on: '.yellow
    + uri.cyan);

    if (fileConfig) {
        log ("Use config file ".cyan + configFileName.cyan);
    }

    log('Hit CTRL-C to stop the server'.magenta);
    if (fileConfig.open || argv.o) {
        opener(uri);
    }
});