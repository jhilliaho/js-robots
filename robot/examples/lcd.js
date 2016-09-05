// Example of using I2C display
//
// Jani Hilliaho 2016

var five = require("johnny-five");
var Raspi = require("raspi-io");

var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
	var lcd = new five.LCD({
		controller: "PCF8574AT",
		address: 0x27,
		rows: 2,
		cols: 16
	});

	lcd.noAutoscroll().print("Hello World!");
	lcd.noBlink();
});