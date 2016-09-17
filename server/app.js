// Node.js App for transfering messages between web client and devices	
//
// Jani Hilliaho 2016

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('view engine', 'ejs');

server.listen(3000);

app.use('/static', express.static(__dirname + '/public'));


io.on('connection', function (socket) {
	console.log("New connection");

	socket.on('controllerDataFromBrowser', function (data) {
		console.log("Sending controllerDataFromBrowser as speedAndAngleFromServer", data);
		var dataToRobot = {
			angle1: posToAngle(data.x1,data.y1),
			speed1: posToSpeed(data.x1,data.y1),
			angle2: posToAngle(data.x2,data.y2),
			speed2: posToSpeed(data.x2,data.y2),
			x1: data.x1,
			y1: data.y1,
			x2: data.x2,
			y2: data.y2
		}
		socket.broadcast.emit("speedAndAngleFromServer", dataToRobot);
		console.log("Sending angle and speed: ", posToAngle(data.x1, data.y1), posToSpeed(data.x1, data.y1));
  	});
    
	socket.on("radarData", function(data){
		console.log("Radar data", data);
		socket.broadcast.emit("radarData", data);		
	});

    socket.on('disconnect', function () {
      console.log("Disconnected");
    });
});

app.get('/', function(req, res, next) {
	res.render('gamepad');
});

console.log("Server has been starter");
	
// Function calculates the angle and distance of joystick
function posToAngle(x,y) {
	var angle = Math.atan(x/y) * 57.2957795;
	if (y < 0) {angle += 180;}
	while (angle < 0) {angle += 360;}
	while (angle > 360) {angle -= 360;}
	if (angle == -0) {angle = 0;}
	return Math.round(angle);
}

function posToSpeed(x, y) {
	var speed = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
	if (speed > 100) {
		speed = 100;
	}
	return Math.round(speed);
}
