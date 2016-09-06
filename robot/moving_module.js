// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

	"use strict"

	exports.calcMotorSpeeds = calcMotorSpeeds;
	exports.activateModule = activateModule;

	var motor1, motor2, motor3, board;
	motor1 = motor2 = motor3 = {};

	function activateModule(board_) {
		board = board_;
	};

	function sendMotorSpeeds() {

		motor1.speed = Math.round(motor1.speed);
		motor2.speed = Math.round(motor2.speed);
		motor3.speed = Math.round(motor3.speed);

		motor1.speed = motor1.speed > 255 ? 255 : motor1.speed
		motor1.speed = motor1.speed < 0 ? 0 : motor1.speed

		motor2.speed = motor2.speed > 255 ? 255 : motor2.speed
		motor2.speed = motor2.speed < 0 ? 0 : motor2.speed

		motor3.speed = motor3.speed > 255 ? 255 : motor3.speed
		motor3.speed = motor3.speed < 0 ? 0 : motor3.speed

		var bytes = [motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir];

		try {
			board.io.i2cWrite(0x8, bytes);
		} catch (ex) {
			console.log("ERROR IN I2C WRITING", ex);
		}
	}

	function calcMotorSpeeds(angle, speed, rotation) {

		angle = parseInt(angle);
		speed = parseInt(speed)*4;
		rotation = parseInt(rotation);

		// Angle as degrees
		var motorArr = calcMovement(angle);
		
		motorArr[0] *= speed; //3
		motorArr[1] *= speed; //2
		motorArr[2] *= speed; //1

		motorArr[0] += rotation/2;
		motorArr[1] += rotation/2;
		motorArr[2] += rotation/2;

		motor1 = {
			speed: Math.round(Math.abs(motorArr[0])),
			dir: motorArr[0] > 1 ? 1 : 0
		};
		motor2 = {
			speed: Math.round(Math.abs(motorArr[1])),
			dir: motorArr[1] > 1 ? 1 : 0
		};
		motor3 = {
			speed: Math.round(Math.abs(motorArr[2])),
			dir: motorArr[2] > 1 ? 1 : 0
		};
		sendMotorSpeeds();
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

	// Function to calculate relative motor speeds
	function calcMovement(angle){

		// Base angles: 0, 90, 180, 270, 360
		var baseMovements = [[0, -1, 1], [1, -0.5, -0.5], [0, 1, -1], [-1, 0.5, 0.5], [0, -1, 1]];
		
		var quarter = 0;

		while (angle >= 360) {
			angle -= 360;
		}

		while (angle >= 90) {
			quarter++;
			angle -= 90;
		}

		if (angle == 0) {
			return baseMovements[quarter];
		}

		var yVector = multiplyArray(baseMovements[quarter], Math.cos(degreesToRadians(angle)));
		var xVector = multiplyArray(baseMovements[quarter+1], Math.sin(degreesToRadians(angle)));

		var sum = sumOfArrays(xVector, yVector);
		var rounded = roundArray(sum,3);

		return rounded;
	}	
