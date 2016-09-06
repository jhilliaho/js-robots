// Node.js modules
// 11.7 = 64%
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

// Own modules
var moving = require("./moving_module.js");
var programs = require("./programs_module.js");
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
	programs.runAngle(0, 10, 1000);
	setTimeout(function(){
		programs.runAngle(90, 10, 1000);
	},1000);
	setTimeout(function(){
		programs.runAngle(180, 10, 1000);
	},2000);
	setTimeout(function(){
		programs.runAngle(270, 10, 1000);
	},3000);

}
