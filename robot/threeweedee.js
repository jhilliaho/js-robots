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

	ENA.on();
	ENA.brightness(128);
	ENB.on();
	ENB.brightness(128);
	
	IN1.off();
	IN2.off();
	IN3.off();
	IN4.off();

	var date = 0;

for (var i = 0; i < 10; ++i) {
    IN1.off();
    IN2.on();

    IN3.off();
    IN4.on();
	date = Date.now()+200;
	while (Date.now() < date) {} 
    IN2.off();
    IN1.on();

    IN3.off();
    IN4.on();
	date = Date.now()+200;
	while (Date.now() < date) {} 
    IN2.off();
    IN1.on();

    IN4.off();
    IN3.on();
	date = Date.now()+200;
	while (Date.now() < date) {} 
    IN1.off();
    IN2.on();

    IN4.off();
    IN3.on();
	date = Date.now()+200;
	while (Date.now() < date) {} 
}

	console.log("Shut down");

	ENA.off();
	ENA.brightness(0);
	ENB.off();
	ENB.brightness(0);
	
	IN1.off();
	IN2.off();
	IN3.off();
	IN4.off();






	



});




process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})





