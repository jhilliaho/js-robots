var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.set('view engine', 'ejs');

var imageDate = 0;

var posToAngle = function posToAngle(x, y) {
	var angle = 0;
	var angle = Math.atan(y/x) * 57.295;
	if (x < 0) {
		angle = 180 + angle;
	}
	if (y > 0) {
		angle = 360 + angle;
	}
	return angle;
}

server.listen(3000);

app.use('/static', express.static(__dirname + '/public'));


io.on('connection', function (socket) {
	console.log("connection");

	socket.on('controllerDataFromBrowser', function (data) {
		console.log("Sending controllerDataFromBrowser as speedAndAngleFromServer", data);
		socket.broadcast.emit("speedAndAngleFromServer", data);
		console.log("angle", posToAngle(data.x1, data.y1));
  	});
});

app.get('/', function(req, res, next) {
	res.render('gamepad');
});

console.log("Started");
	






























