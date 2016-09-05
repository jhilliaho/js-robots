// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict"

exports.connectionData = {
	connected: true,
	lastDataPacket: {}
};

var io = require('socket.io-client');

var socket = require('socket.io-client')('http://46.101.79.118:3000');

socket.once('connect', function() {
	console.log('Connected to server');
});

socket.on("disconnect", function(){
	console.log("Disconnected from server");
});

socket.on("speedAndAngleFromServer", function(data){
	console.log("Data from server", data);
	exports.connectionData.lastDataPacket = data;
});
