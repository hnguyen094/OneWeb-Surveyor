var http = require('stream-http');
var ecstatic = require('ecstatic')(__dirname);
var fs = require('nativescript-node/fs');

var server = http.createServer(function (req, res) {
    ecstatic(req, res);
});

console.log('Listening on :8088');
server.listen(8088);
