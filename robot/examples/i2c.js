// Example of sending data with I2C
//
// Jani Hilliaho 2016

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
	
board.on("ready", function() {
	
	var options = {
		address: 2
	};

	board.io.i2cConfig(options);

	var str = "Hello world!";
	var bytes = [];

	for (var i = 0; i < str.length; ++i) {
	    bytes.push(str.charCodeAt(i));
	}

	board.io.i2cWrite(0x8, bytes);
});