var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {


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

		var options = {
			address: 2
		};

		board.io.i2cConfig(options);

		var ENA = new five.Led({
			address: 0x40,
			controller: "PCA9685",
			pin: 2,
		});

		var IN1 = new five.Led({
			address: 0x40,
			controller: "PCA9685",
			pin: 1,
		});

		var IN2 = new five.Led({
			address: 0x40,
			controller: "PCA9685",
			pin: 0,
		});

		ENA.brightness(255);
		IN1.on();
		IN2.off();

		setTimeout(function(){
			ENA.brightness(0);
		}, 100);
	});


});




process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})




