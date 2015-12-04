var five = require("johnny-five");
var Raspi = require("raspi-io");

var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
	// Set LCD screen
	var lcd = new five.LCD({
		controller: "PCF8574AT",
		address: 0x27
	});

	lcd.autoscroll().print("Bloop").print("Bleep").print("Bloop").print("Bleep").print("Bloop").print("Bleep").print("Bloop").print("Bleep").print("Bloop").print("Bleep").print("Bloop").print("Bleep").print("Bloop").print("Bleep").print("Bloop").print("Bleep");

});