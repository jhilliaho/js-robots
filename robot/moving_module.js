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
		cb = callback;
		movementCalculator.send(angle);
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
				console.log("Send to teensy", bytes);
				board.io.i2cWrite(0x8, bytes);
			} catch (ex) {
				console.log("ERROR IN I2C WRITING", ex);
			}
				
		});
	}


