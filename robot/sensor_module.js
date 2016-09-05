// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict"

var SerialPort = require("serialport");

exports.activateModule = activate;
exports.sensorData = {
	lidar: 0,
	compass: 0,
	gyro: 0,
}

var board = {};
var five = {};

function activate(five_, board_){
	five = five_;
	board = board_;

	console.log("Activate module");

	board.io.i2cWrite(0x68, [0x37, 0x02, 0x6A, 0x00, 0x6B, 0x00]);

	var lidar = new SerialPort("/dev/ttyUSB0", {baudRate: 115200});
	var imu = new five.IMU({controller: "MPU6050"});
	var compass = new five.Compass({controller: "HMC5883L"});	

	// Event handlers
	lidar.on('data', function (num) {
		//console.log("LidarData, ", num.toString());
		exports.sensorData.lidar = num.toString();
	});

	compass.on("change", function() {
		//console.log("CompassData: ", this.bearing.heading);
		exports.sensorData.compass = this.bearing.heading;
	});

	imu.on("change", function() {
		//console.log("GyroData: ", this.gyro.roll.angle);
		exports.sensorData.gyro = this.gyro.roll.angle;
	});		
}


