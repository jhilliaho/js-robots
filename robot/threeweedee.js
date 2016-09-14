// Node.js modules
// 11.7 = 64%
// 11.46 = 41%
var death = require("death");
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

// Own modules
var programs = require("./programs_module.js");
var sensors = require("./sensor_module.js");

board.on("ready", function() {
	board.io.i2cConfig();
	sensors.activateModule(five, board);
	programs.activateModule(board);
	console.log(sensors.moduleState);
	run();
});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
    return true;
});

process.on('exit', function (){
  console.log("Quitting.");
  moving.stopMotors();
});

death(function(signal, err) {
  console.log("quitting");
  moving.stopMotors();
})

function run() {

	programs.pointAngle([0,10,20,30]);
}	
