// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

"use strict"

var functionList = {};

process.on('message', (m) => {
	console.log("Got ", m, " to calculator");
    calcMovement(m);
});

// Function to calculate relative motor speeds
function calcMovement(angle){

	console.log("CalcMovements start");

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
		return baseMovements[quarter];
	}

	var yVector = multiplyArray(baseMovements[quarter], Math.cos(degreesToRadians(angle)));
	var xVector = multiplyArray(baseMovements[quarter+1], Math.sin(degreesToRadians(angle)));

	var sum = sumOfArrays(xVector, yVector);
	var rounded = roundArray(sum,3);

	console.log("Return ", rounded, " from calculator");

	process.send(rounded);
}
