var config  = require('src/libs/config');
var db      = require('src/libs/database');

// HTTP...

var server  = require('http').createServer();

// HTTPS...

//var server = require('https').createServer({
//    key:    fs.readFileSync('ssl/server.key'),
//    cert:   fs.readFileSync('ssl/server.crt'),
//    ca:     fs.readFileSync('ssl/ca.crt')
//});

var fs      = require('fs');
var ioAuth  = require('socketio-auth');
var io      = require('socket.io')(server);

ioAuth(io, {

    authenticate: function (socket, data, callback) {

        db.authenticateUser(data).then(function () {
            return callback(null, true);
        }, function (reason) {
            return callback(new Error(reason.err));
        });

    }

});

io.sockets.on('connection', function (socket) {

    console.log('socket connected');

    socket.on('client:request-data', function (options) {

        db.requestData(options).then(function (routeData) {

            socket.emit('server:route-data', routeData);

        }, function (reason) {

            socket.emit('server:error', {
                err: 'general error'
            });

        });

    });

    socket.on('disconnect', function () {
        console.log('socket disconnected');
    });

});


server.listen(config.get('port'));
