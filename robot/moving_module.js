// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

	"use strict";

	exports.setMotorSpeeds = calcMotorSpeeds;
	exports.activateModule = activateModule;
	exports.stopMotors = stopMotors;

	var board;

	const cp = require('child_process');
	const movementCalculator = cp.fork('moving_calculation_module.js');

	var cb = null;

	function calcMovement(params, callback) {
		cb = callback;
		movementCalculator.send(params);
	}

	movementCalculator.on('message', (m) => {
		cb(m);
	});

	function activateModule(board_) {
		board = board_;
	}

	function calcMotorSpeeds(angle, speed, rotation) {

		angle = parseInt(angle);
		speed = parseInt(speed)*4;
		rotation = parseInt(rotation);

		// Angle as degrees
		calcMovement({angle: angle, speed: speed, rotation: rotation}, function(bytes){
			
			try {
				board.io.i2cWrite(0x8, bytes);
			} catch (ex) {
				console.log("ERROR IN I2C WRITING", ex);
			}
		});
	}

	function stopMotors() {
		console.log("Moving module stopping motors");
		try {
			board.io.i2cWrite(0x8, [0,0,0,0,0,0]);
		} catch (ex) {
			console.log("ERROR IN I2C WRITING", ex);
		}
	}

