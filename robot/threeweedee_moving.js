// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

(function(){

	"use strict"

	exports.calculateRelativeMotorSpeeds = calcMovement;

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
	function calcMovement(angle, speed, rotation){

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

		rounded[0] *= speed/4;
		rounded[1] *= speed/4;
		rounded[2] *= speed/4;


		return rounded;
	}	
})()
