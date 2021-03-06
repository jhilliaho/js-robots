// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict"

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('view engine', 'ejs');

server.listen(3000);

app.use('/', express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
	res.render('gamepad');
});

var programs = require("./programs_module.js");

exports.moduleState = {
	connected: false,
	lastDataPacket: {}
};

exports.sendRadarData = sendRadarData;
exports.sendImage = sendImage;

function sendImage(data){
	if (socket_ != undefined) {
		socket_.emit("newImage", data);
	}
}

// Function calculates the angle and distance of joystick
function posToAngle(x,y) {
	if (isNaN(x)) {x = 0;}
	if (isNaN(y)) {y = 0;}
	if (x == 0 && y == 0) {return 0;}
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

var socket_;
var lastSentRadarData = {angle: 0, distance: 0, date: 0};
function sendRadarData(angle, distance) {
	var dateNow = Date.now();
	
	if (dateNow - lastSentRadarData.date < 1000 && angle === lastSentRadarData.angle && Math.abs(lastSentRadarData.distance - distance) < 30) {
		return;
	}

	lastSentRadarData.angle = angle;
	lastSentRadarData.distance = distance;
	lastSentRadarData.date = dateNow;
	if (socket_ != undefined) {
		socket_.emit("radarData", {angle: angle, distance: distance});
	}
}

io.on('connection', function (socket) {
	socket_ = socket;
	console.log("New connection");

	socket.on('controllerDataFromBrowser', function (data) {
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
		exports.moduleState.lastDataPacket = dataToRobot;
		programs.newControllerData(dataToRobot);
  	});


    socket.on('disconnect', function () {
      console.log("Disconnected");
    });
});









