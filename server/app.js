var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.set('view engine', 'ejs');

var imageDate = 0;

server.listen(3000);

app.use('/static', express.static(__dirname + '/public'));


io.on('connection', function (socket) {
	console.log("connection");

	socket.on('controllerDataFromBrowser', function (data) {
		console.log("Sending controllerDataFromBrowser as speedAndAngleFromServer", data);
		socket.broadcast.emit("speedAndAngleFromServer", data);
  	});
});

app.get('/', function(req, res, next) {
	res.render('gamepad');
});

console.log("Started");
	






























