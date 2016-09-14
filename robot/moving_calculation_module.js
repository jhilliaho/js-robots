// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict"

var functionList = {};

process.on('message', (m) => {
    calcMovement(m);
});

// Function to calculate relative motor speeds
function calcMovement(params){
	console.log("Calcmovement", params);
	var angle = params.angle;

	var returnValue = [];

	// Base angles: 0, 90, 180, 270, 360
	var baseMovements = [[1, 0, -1], [0.5, -1, 0.5], [-1, 0, 1], [-0.5, 1, -0.5], [1, 0, -1]];
	
	var quarter = 0;

	while (angle >= 360) {
		angle -= 360;
	}

	while (angle >= 90) {
		quarter++;
		angle -= 90;
	}

	if (angle == 0) {
		calculateBytes(baseMovements[quarter]);
	} else {
		var yVector = multiplyArray(baseMovements[quarter], Math.cos(degreesToRadians(angle)));
		var xVector = multiplyArray(baseMovements[quarter+1], Math.sin(degreesToRadians(angle)));
		var sum = sumOfArrays(xVector, yVector);
		var rounded = roundArray(sum,3);
		calculateBytes(rounded, params.speed, params.rotation);
	}
}
function calculateBytes(motorArr, speed, rotation) {
	console.log("CalculateBytes", motorArr, speed, rotation);

	motorArr[0] *= speed; // Motor 1
	motorArr[1] *= speed; // Motor 2
	motorArr[2] *= speed; // Motor 3

	motorArr[0] += rotation/2;
	motorArr[1] += rotation/2;
	motorArr[2] += rotation/2;

	var motor1 = {
		speed: Math.abs(motorArr[0]),
		dir: motorArr[0] > 0 ? 0 : 1
	};
	var motor2 = {
		speed: Math.abs(motorArr[1]),
		dir: motorArr[1] > 0 ? 0 : 1
	};
	var motor3 = {
		speed: Math.abs(motorArr[2]),
		dir: motorArr[2] > 0 ? 0 : 1
	};

	motor1.speed = motor1.speed > 255 ? 255 : motor1.speed
	motor2.speed = motor2.speed > 255 ? 255 : motor2.speed
	motor3.speed = motor3.speed > 255 ? 255 : motor3.speed

	var bytes = [motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir];
	process.send(bytes);
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