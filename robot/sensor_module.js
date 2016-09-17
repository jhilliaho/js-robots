// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict";

var SerialPort = require("serialport");
var connection = require("./connection_module.js");

exports.activateModule = activate;
exports.clearDistances = clearDistances;
exports.moduleState = {
	lidar: 0,
	compass: 0,
	gyro: 0,
	distances: {},
	longestDistance: 0,
	longestDirection: 0,
};

var board = {};
var five = {};

function clearDistances() {
	exports.moduleState.distances = {};
	exports.moduleState.longestDistance = 0;
	exports.moduleState.longestDirection = 0;
}

function activate(five_, board_){
	console.log("Sensors activated");
	five = five_;
	board = board_;

	// Configurate the imu module
	board.io.i2cWrite(0x68, [0x37, 0x02, 0x6A, 0x00, 0x6B, 0x00]);

	var imu = new five.IMU({controller: "MPU6050"});
	var compass = new five.Compass({controller: "HMC5883L"});	

	var lidar = new SerialPort("/dev/ttyUSB0", {
		baudRate: 115200,
		parser: SerialPort.parsers.readline('\r\n')
	});

	compass.on("change", function() {
		exports.moduleState.compass = this.bearing.heading - 120;
	});

	imu.on("change", function() {
		exports.moduleState.gyro = this.gyro.yaw.angle;
	});		

	// Event handlers
	lidar.on('data', function (num) {
		num = parseInt(num);
		exports.moduleState.lidar = num;
		exports.moduleState.distances[exports.moduleState.compass] = num;
		connection.sendRadarData(exports.moduleState.compass, num);
		if (num > exports.moduleState.longestDistance) {
			exports.moduleState.longestDistance = num;
			exports.moduleState.longestDirection = exports.moduleState.compass;
		}
	});
}

