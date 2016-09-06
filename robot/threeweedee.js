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
});
