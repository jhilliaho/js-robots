// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict"

var programs = require("./programs_module.js");

exports.moduleState = {
	connected: false,
	lastDataPacket: {}
};

exports.sendRadarData = sendRadarData;

var io = require('socket.io-client');

var socket = require('socket.io-client')('http://46.101.79.118:3000');

socket.once('connect', function() {
	exports.moduleState.connected = true;
	console.log('Connected to server');
});

socket.on("disconnect", function(){
	exports.moduleState.connected = false;
	console.log("Disconnected from server");
});

socket.on("speedAndAngleFromServer", function(data){
	exports.moduleState.lastDataPacket = data;
	programs.newControllerData(data);
});


var lastSentRadarData = {angle: 0, distance: 0, date: 0};
function sendRadarData(angle, distance) {
	var dateNow = Date.now();
	
	if (dateNow - lastSentRadarData.date < 1000 && angle === lastSentRadarData.angle && Math.abs(lastSentRadarData.distance - distance) < 30) {
		return;
	}

	lastSentRadarData.angle = angle;
	lastSentRadarData.distance = distance;
	lastSentRadarData.date = dateNow;

	socket.emit("radarData", {angle: angle, distance: distance});
}
