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

	var ENAJ = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 0,
	});

	var IN1J = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 1,
	});

	var IN2J = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 2,
	});



	var ENAK = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 6,
	});

	var IN1K = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 4,
	});

	var IN2K = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 5,
	});

	

	var ENAL = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 10,
	});

	var IN1L = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 8,
	});

	var IN2L = new five.Led({
		address: 0x40,
		controller: "PCA9685",
		pin: 9,
	});


	ENAJ.brightness(255);
	IN1J.on();
	IN2J.off();

	ENAK.brightness(255);
	IN1K.on();
	IN2K.off();

	ENAL.brightness(255);
	IN1L.on();
	IN2L.off();


	setTimeout(function(){

		ENAJ.brightness(0);
		IN1J.off();
		IN2J.off();

		ENAK.brightness(0);
		IN1K.off();
		IN2K.off();

		ENAL.brightness(0);
		IN1L.off();
		IN2L.off();


	}, 5000);


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





