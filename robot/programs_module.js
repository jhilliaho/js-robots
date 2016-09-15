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
			console.log("Moving interval");
			var currentAngle = sensors.moduleState.compass;

			if (Math.abs(currentAngle - destinationAngle) < 8) {
				console.log("Now pointing to angle", destinationAngle, " with angle ", currentAngle);
				if (destinations.length > counter) {
					console.log("Get next destination");
					destinationAngle = destinations[counter];
					counter++;
				} else {
					console.log("Clearing interval");
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
				var speed = Math.abs(destinationAngle - currentAngle) * 6;
				speed = (speed > 60) ? 60 : speed;
				moving.setMotorSpeeds(0,0,speed * direction);
			}
		},250);
	}	

	function runAngle(destinationAngle, speed, time) {
		var startTime = Date.now();
		var endTime = startTime + time;
		console.log("runAngle", destinationAngle);		
		var interval = setInterval(function(){
			if (Date.now() >= endTime) {
				clearInterval(interval);
				moving.setMotorSpeeds(destinationAngle, 0, 0);
			} else {
				moving.setMotorSpeeds(destinationAngle, 20, 0);
			}
		},50);
	}

	function radar(){
		var currentAngle = sensors.moduleState.compass;
		console.log("Radaring");

		// Tyhjennä pituudet
		sensors.clearDistances();

		// Pyörähdä
		pointAngle([currentAngle,currentAngle+120,currentAngle+240,currentAngle, currentAngle+20], function(){

			console.log("Longest distance ", sensors.moduleState.longestDistance, " at direction ", sensors.moduleState.longestDirection);

			pointAngle([sensors.moduleState.longestDirection]);
		});


	}





