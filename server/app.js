var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.set('view engine', 'ejs');

var imageDate = 0;

var posToAngle = function posToAngle(y,xchr) {
	var angle = 0;
	var angle = Math.atan(y/x) * 57.2957795;

	if (x < 0 || (x < 0 && y < 0)) {
		angle = 180 + angle;
	}
	else if (y < 0) {
		angle = 360 + angle;
	}

	if (x == 0 && y == 0) {
		angle = 0;
	}

	return Math.round(angle);
}

var posToSpeed = function posToAngle(x, y) {
	var speed = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
	if (speed > 100) {
		speed = 100;
	}
	return Math.round(speed);

}

server.listen(3000);

app.use('/static', express.static(__dirname + '/public'));


io.on('connection', function (socket) {
	console.log("connection");

	socket.on('controllerDataFromBrowser', function (data) {
		console.log("Sending controllerDataFromBrowser as speedAndAngleFromServer", data);
		var dataToRobot = {
			angle1: posToAngle(data.x1,data.y1),
			speed1: posToSpeed(data.x1,data.y1),
			x2: data.x2,
			y2: data.y2
		}
		socket.broadcast.emit("speedAndAngleFromServer", dataToRobot);
		console.log("angle and speed", posToAngle(data.x1, data.y1), posToSpeed(data.x1, data.y1));
  	});
});

app.get('/', function(req, res, next) {
	res.render('gamepad');
});

console.log("Started");
	






























