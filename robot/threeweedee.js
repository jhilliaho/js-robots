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

	var ENA = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 0,
	});

	var ENB = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 1,
	});

	var IN1 = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 4,
	});

	var IN2 = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 5,
	});

	var IN3 = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 6,
	});

	var IN4 = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 7,
	});

	ENA.off();
	ENB.off();
	
	IN1X.off();
	IN2X.off();
	IN3X.off();
	IN4X.off();









	



});




process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})





