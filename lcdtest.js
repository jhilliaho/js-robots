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

	lcd.cursor(0,0).print("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
	lcd.cursor(0,0).print("Hello World!")

	// Function to print something on the lcd
	function printToLcd(row, text) {
		lcd.cursor(row, 0).print(text);
	}
});