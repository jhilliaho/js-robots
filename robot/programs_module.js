// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

	"use strict";

	var moving = require("./moving_module.js");
	var sensors = require("./sensor_module.js");
	var board = {};

	exports.pointAngle = pointAngle;
	exports.runAngle = runAngle;
	exports.radar = radar;
	exports.activateModule = activateModule;
	exports.stopMotors = moving.stopMotors;

	function activateModule(board_) {
		board = board_;
		moving.activateModule(board_);
	}

	function pointAngle(destinations, callback) {

		var destinationAngle = destinations[0];
		var counter = 1;
		var pointAngleInterval = 0;

		console.log("Pointangle", destinationAngle);		
		var pointAngleInterval = setInterval(function(){
			while (destinationAngle >= 360) {
				destinationAngle -= 360;
			}
			while (destinationAngle < 0) {
				destinationAngle += 360;
			}
			var currentAngle = sensors.moduleState.compass;

			if (Math.abs(currentAngle - destinationAngle) < 8) {
				if (destinations.length > counter) {
					destinationAngle = destinations[counter];
					console.log("Pointangle", destinationAngle);		
					counter++;
				} else {
					clearInterval(pointAngleInterval);
					if (typeof callback === "function") {
						callback();
					}
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
				var speed = Math.abs(destinationAngle - currentAngle) * 4;
				speed = (speed > 100) ? 100 : speed;
				speed = 80;
				moving.setMotorSpeeds(0,0,speed * direction);
			}
		},100);
	}	

	function runAngle(destinationAngle, speed, time) {
		var startingAngle = sensors.moduleState.gyro;

		var startTime = Date.now();
		var endTime = startTime + time;
		console.log("runAngle", destinationAngle);		
		var interval = setInterval(function(){
			var angleNow = sensors.moduleState.gyro;

			var addRotation = Math.round((angleNow - startingAngle) * 2.5);

			if (Date.now() >= endTime) {
				clearInterval(interval);
				moving.setMotorSpeeds(destinationAngle, 0, 0);
			} else {
				moving.setMotorSpeeds(destinationAngle, speed, addRotation);
			}
		},50);
	}

	function radar(){
		var ca = sensors.moduleState.compass;
		console.log("Radaring starting from angle ", ca);

		// Tyhjennä pituudet
		sensors.clearDistances();

		// Pyörähdä
		pointAngle([ca,ca+120,ca+240,ca,ca+20], function(){
			console.log("Longest distance ", sensors.moduleState.longestDistance, " at direction ", sensors.moduleState.longestDirection);
			pointAngle([sensors.moduleState.longestDirection], function(){
				runAngle(0, 10, 10000);
			});
		});


	}





