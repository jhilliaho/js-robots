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
	pointAngle(0);
}


function pointAngle(destinationAngle) {


	var interval = setInterval(function(){

		var currentAngle = sensors.moduleState.compass;
		console.log(currentAngle, " -> ", destinationAngle);

		if (Math.abs(currentAngle - destinationAngle) < 10) {
			console.log("Now pointing to angle", destinationAngle);
			clearInterval(interval);
			moving.setMotorSpeeds(0,0,0);
			return;
		} else {
			var direction = (currentAngle < destinationAngle) ? 1 : -1;


			moving.setMotorSpeeds(0,0,10 * direction);
		}
	},100);
}