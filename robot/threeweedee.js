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
		pin: 0,
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

	ENX.brightness(0);
	
	IN1X.off();
	IN2X.off();
	IN3X.off();
	IN4X.off();


	setTimeout(function(){
		IN1X.off();
		IN3X.off();
		IN2X.on();
		IN4X.on();
	},200);

	setTimeout(function(){
		IN2X.off();
		IN3X.off();
		IN1X.on();
		IN4X.on();
	},400);

	setTimeout(function(){
		IN2X.off();
		IN4X.off();
		IN1X.on();
		IN3X.on();
	},600);

	setTimeout(function(){
		IN1X.off();
		IN4X.off();
		IN2X.on();
		IN3X.on();
	},800);



	setTimeout(function(){
		IN1X.off();
		IN3X.off();
		IN2X.on();
		IN4X.on();
	},1000);

	setTimeout(function(){
		IN2X.off();
		IN3X.off();
		IN1X.on();
		IN4X.on();
	},1200);

	setTimeout(function(){
		IN2X.off();
		IN4X.off();
		IN1X.on();
		IN3X.on();
	},1400);

	setTimeout(function(){
		IN1X.off();
		IN4X.off();
		IN2X.on();
		IN3X.on();
	},1600);



	setTimeout(function(){
		IN1X.off();
		IN4X.off();
		IN2X.off();
		IN3X.off();
		ENX.brightness(0);
	},1800);








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





