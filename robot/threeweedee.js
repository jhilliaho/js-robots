// Node.js modules
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

// Own modules
var moving = require("./moving_module.js");
var connection = require("./connection_module.js");
var sensors = require("./sensor_module.js");

board.on("ready", function() {
	board.io.i2cConfig();
	sensors.activateModule(five, board);
	moving.activateModule(board);
	console.log(sensors.moduleState);
	run();

});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
    return true;
})


function run() {
	pointAngle(50);
}


function pointAngle(destinationAngle) {

	var pointAngleLock = false;
	var interval = setInterval(function(){
		if (pointAngleLock) {return;}
		pointAngleLock = true;
		var currentAngle = sensors.moduleState.compass;

		if (Math.abs(currentAngle - destinationAngle) < 4) {
			console.log("Now pointing to angle", destinationAngle);
			//clearInterval(interval);
			moving.setMotorSpeeds(0,0,0);
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

			console.log(currentAngle, " -> ", destinationAngle, " with direction ", direction, " and speed ", speed);

			moving.setMotorSpeeds(0,0,speed * direction);
		}
		pointAngleLock = false;

	},20);
}