// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict"

var SerialPort = require("serialport");

exports.activateModule = activate;
exports.moduleState = {
	lidar: 0,
	compass: 0,
	gyro: 0,
	distances: {},
	longestDistance: 0,
	longestDirection: 0,
}
exports.clearDistances = clearDistances;

var board = {};
var five = {};

function clearDistances() {
	exports.moduleState.distances = {};
}

function activate(five_, board_){
	five = five_;
	board = board_;

	// Configurate imu module
	board.io.i2cWrite(0x68, [0x37, 0x02, 0x6A, 0x00, 0x6B, 0x00]);

	var lidar = new SerialPort("/dev/ttyUSB0", {
		baudRate: 115200,
		parser: SerialPort.parsers.readline('\r\n')
	});

	var imu = new five.IMU({controller: "MPU6050"});
	var compass = new five.Compass({controller: "HMC5883L"});	

	// Event handlers
	lidar.on('data', function (num) {
		exports.moduleState.lidar = num;
		//console.log("lidar, compass: ", num, " at ", exports.moduleState.compass);
		exports.moduleState.distances[exports.moduleState.compass] = num;
	});

	compass.on("change", function() {
		exports.moduleState.compass = this.bearing.heading;
	});

	imu.on("change", function() {
		exports.moduleState.gyro = this.gyro.roll.angle;
	});		
}

