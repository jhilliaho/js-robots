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


	var interval = setInterval(function(){

		var currentAngle = sensors.moduleState.compass;

		if (Math.abs(currentAngle - destinationAngle) < 3) {
			console.log("Now pointing to angle", destinationAngle);
			//clearInterval(interval);
			moving.setMotorSpeeds(0,0,0);
			return;
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

			var speed = 60;

			console.log(currentAngle, " -> ", destinationAngle, " with direction ", direction, " and speed ", speed);

			moving.setMotorSpeeds(0,0,speed * direction);
		}
	},100);
}