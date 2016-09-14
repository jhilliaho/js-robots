// Node.js Module to calculate relative motor speeds by target angle for 3WD omniwheel robot
//
// Jani Hilliaho 2016

	"use strict"

	exports.setMotorSpeeds = calcMotorSpeeds;
	exports.activateModule = activateModule;

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
	};

	function calcMotorSpeeds(angle, speed, rotation) {

		console.log("Calculating speeds");

		angle = parseInt(angle);
		speed = parseInt(speed)*4;
		rotation = parseInt(rotation);

		// Angle as degrees
		calcMovement([angle, speed, rotation], function(motorArr){
			
			try {
				console.log("Send to teensy", bytes);
				board.io.i2cWrite(0x8, bytes);
			} catch (ex) {
				console.log("ERROR IN I2C WRITING", ex);
			}
		});
	}


