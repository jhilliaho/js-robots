// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

	"use strict"

	var moving = require("./moving_module.js");
	var connection = require("./connection_module.js");
	var sensors = require("./sensor_module.js");

	exports.pointAngle = pointAngle;
	exports.runAngle = runAngle;
	exports.kaarra = kaarra;
	exports.programLocks = programLocks;

	var programLocks = {};

	function pointAngle(destinationAngle) {
		console.log("Pointangle", destinationAngle);		
		programLocks.pointAngleLock = false;
		var interval = setInterval(function(){
			if (programLocks.pointAngleLock) {return;}
			programLocks.pointAngleLock = true;
			var currentAngle = sensors.moduleState.compass;

			if (Math.abs(currentAngle - destinationAngle) < 4) {
				console.log("Now pointing to angle", destinationAngle);
				clearInterval(interval);
				moving.setMotorSpeeds(0,0,0);
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
		},20);
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
		},20);
	}

	function kaarra(){
		var angle = 0;
		var interval = setInterval(function(){
			moving.setMotorSpeeds(angle++, 20, 0);
			if (angle >= 360) {
				clearInterval(interval);
				moving.setMotorSpeeds(0, 0, 0);
			}
		},20);
	}







