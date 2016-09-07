// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

	"use strict"

	exports.setMotorSpeeds = calcMotorSpeeds;
	exports.activateModule = activateModule;

	var motor1, motor2, motor3, board;
	motor1 = motor2 = motor3 = {};





	const cp = require('child_process');
	const movementCalculator = cp.fork('moving_calculation_module.js');

	var cb = null;

	function calcMovement(angle, callback) {
		movementCalculator.send(angle);
		cb = callback;
	}

	movementCalculator.on('message', (m) => {
		cb(m);
	});







	function activateModule(board_) {
		board = board_;
	};

	function calcMotorSpeeds(angle, speed, rotation) {

		angle = parseInt(angle);
		speed = parseInt(speed)*4;
		rotation = parseInt(rotation);

		// Angle as degrees
		calcMovement(angle, function(motorArr){
			
			motorArr[0] *= speed; // Motor 1
			motorArr[1] *= speed; // Motor 2
			motorArr[2] *= speed; // Motor 3

			motorArr[0] += rotation/2;
			motorArr[1] += rotation/2;
			motorArr[2] += rotation/2;

			motor1 = {
				speed: Math.abs(motorArr[0]),
				dir: motorArr[0] > 0 ? 0 : 1
			};
			motor2 = {
				speed: Math.abs(motorArr[1]),
				dir: motorArr[1] > 0 ? 0 : 1
			};
			motor3 = {
				speed: Math.abs(motorArr[2]),
				dir: motorArr[2] > 0 ? 0 : 1
			};

			motor1.speed = motor1.speed > 255 ? 255 : motor1.speed
			motor2.speed = motor2.speed > 255 ? 255 : motor2.speed
			motor3.speed = motor3.speed > 255 ? 255 : motor3.speed

			var bytes = [motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir];

			try {
				board.io.i2cWrite(0x8, bytes);
			} catch (ex) {
				console.log("ERROR IN I2C WRITING", ex);
			}
				
		});
	}

	// Function to multiply arrays
	function multiplyArray(arr, multiplier) {
		var temp = [];
		for (var i = 0; i < arr.length; ++i) {
			temp[i] = arr[i] * multiplier;
		}
		return temp;
	}

	// Function to calculate sum of two arrays
	function sumOfArrays(arr1, arr2) {
		if (arr1.length !== arr2.length) {
			console.log("Arrays have different lengths");
			return null;
		}
		var arr = [];
		for (var i = 0; i < arr1.length; ++i) {
			arr[i] = (arr1[i] + arr2[i]);
		}
		return arr;
	}

	// Function to round arrays
	function roundArray(arr, digits){
		var temp = [];
		var multiplier = Math.pow(10, digits);
		for (var i = 0; i < arr.length; ++i) {
			temp[i] = Math.round(arr[i] * multiplier) / multiplier;
		}
		return temp;
	}

	// Function to normalize arrays
	function normalizeArray(arr) {
		var max = 0;
		for (var i = 0; i < arr.length; ++i) {
			max = Math.abs(arr[i]) > max ? Math.abs(arr[i]) : max;
		}

		for (var i = 0; i < arr.length; ++i) {
			arr[i] = arr[i] / max;
		}
		return arr;
	}

	// Function to convert degrees to radians
	function degreesToRadians(degrees) {
		return degrees / (180 / Math.PI);
	}

