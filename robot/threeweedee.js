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

	var ENX = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 1,
	});

	var IN1X = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 4,
	});

	var IN2X = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 5,
	});

	var IN3X = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 6,
	});

	var IN4X = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 7,
	});

	new five.Stepper({
	  type: five.Stepper.TYPE.FOUR_WIRE,
	  stepsPerRev: 200,
	  pins: [ IN1X, IN2X, IN3X, IN4X ]
	});


	console.log("connecting");
	


	var socket = require('socket.io-client')('http://46.101.79.118:3000');

	socket.on("disconnect", function(){
	    console.log("Disconnected from server");
	});

	socket.on("newData", function(data){
		console.log("Got new data, ", data);

	});

	socket.once('connect', function() {
	    console.log('Connected to server');


		console.log("Ready");

	});


});




process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})





