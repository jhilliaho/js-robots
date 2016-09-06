// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

	"use strict"

	var moving = require("./moving_module.js");
	var connection = require("./connection_module.js");
	var sensors = require("./sensor_module.js");

	exports.pointAngle = pointAngle;
	exports.runAngle = runAngle;
	exports.radar = radar;
	exports.programLocks = programLocks;

	var programLocks = {};

	function pointAngle(destinationAngle, callback) {
		console.log("Pointangle", destinationAngle);		
		programLocks.pointAngleLock = false;
		var interval = setInterval(function(){
			if (programLocks.pointAngleLock) {return;}
			programLocks.pointAngleLock = true;
			var currentAngle = sensors.moduleState.compass;

			if (Math.abs(currentAngle - destinationAngle) < 4) {
				console.log("Now pointing to angle", destinationAngle);
				clearInterval(interval);
				if (typeof callback == "function") {
					callback();
				}
			} else {
				var direction = 0;
				if (Math.abs(destinationAngle - currentAngle) > 180) {
					if (destinationAngle > currentAngle) {
						destinationAngle -= 360;
					} else {
						currentAngle -= 360;
					}
				}
				direction = (currentAngle < destinationAngle) ? 1 : -1;
				var speed = Math.abs(destinationAngle - currentAngle) * 6;
				speed = (speed > 60) ? 60 : speed;
				console.log(currentAngle, " -> ", destinationAngle, " with direction ", direction, " and speed ", speed);
				moving.setMotorSpeeds(0,0,speed * direction);
			}
			programLocks.pointAngleLock = false;
		},200);
	}	

	function runAngle(destinationAngle, speed, time) {
		var startTime = Date.now();
		var endTime = startTime + time;
		console.log("runAngle", destinationAngle);		
		programLocks.runAngleLock = false;
		var interval = setInterval(function(){
			if (Date.now() >= endTime) {
				clearInterval(interval);
				moving.setMotorSpeeds(destinationAngle, 0, 0);
			} else {
				moving.setMotorSpeeds(destinationAngle, 20, 0);
			}
			programLocks.runAngleLock = false;
		},50);
	}

	function radar(){
		sensors.clearDistances();
		pointAngle(0,function(){
			pointAngle(120,function(){
				pointAngle(240,function(){
					pointAngle(0,function(){
						pointAngle(sensors.moduleState.longestDirection);
						console.log("Pointing to longestDirection: ", sensors.moduleState.longestDirection, " : ", sensors.moduleState.longestDistance, "mm");
						console.log(sensors.moduleState.distances)
					})
				})
			})
		});
	}





