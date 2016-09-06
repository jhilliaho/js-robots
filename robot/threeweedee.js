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
	run();
});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
    return true;
})





function pointAngle(destinationAngle) {


	var interval = setInterval(function(){


		var currentAngle = sensors.moduleState.compass;

		if (Math.abs(currentAngle - destinationAngle))


		moving.setMotorSpeeds(0,0,currentAngle);

		console.log(connection.moduleState, sensors.moduleState)
	},200);
}