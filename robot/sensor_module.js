// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict"

var SerialPort = require("serialport");
var five = require("johnny-five");

var lidar = new SerialPort("/dev/ttyUSB0", {baudRate: 115200});
var imu = new five.IMU({controller: "MPU6050"});
var compass = new five.Compass({controller: "HMC5883L"});	

// Event handlers
lidar.on('data', function (num) {
	console.log("LidarData, ", num);
});

compass.on("change", function() {
	console.log("CompassData: ", this.bearing.heading);
});

imu.on("change", function() {
	console.log("GyroData: ", this.gyro.roll.angle);
});	
