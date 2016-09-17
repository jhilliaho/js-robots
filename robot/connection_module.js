// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict"

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
	console.log("Data from server", data);
	exports.moduleState.lastDataPacket = data;
});

function sendRadarData(angle, distance) {
	socket.emit("radarData", {angle: angle, distance: distance});
}
