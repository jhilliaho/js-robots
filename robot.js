console.log("Starting the system...");

// WebSocket library
var io = require('socket.io-client');

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

		// PIN OPERATIONS
		var rightGearTick = new five.Pin({
			pin: "GPIO4",
			type: "digital"
		});

		// PIN OPERATIONS
		var leftGearTick = new five.Pin({
			pin: "GPIO17",
			type: "digital"
		});

		rightGearTick.on("high", function(e){
			console.log("right high");
		});

		rightGearTick.on("low", function(e){
			console.log("right high");
		});

		leftGearTick.on("high", function(e){
			console.log("right high");
		});

		leftGearTick.on("low", function(e){
			console.log("right high");
		});

		leftGearTick.read(function(error, value) {
		  console.log(value);
		});

		rightGearTick.read(function(error, value) {
		  console.log(value);
		});

	console.log("Board ready");
	// Set LCD screen
	var lcd = new five.LCD({
		controller: "PCF8574AT",
		address: 0x27,
		rows: 2,
		cols: 16
	});

	lcd.clear().cursor(0, 0).print("BOARD READY");

	// SOCKET.IO
	var socket = io.connect('http://46.101.48.115:8080', {reconnect: true});

	socket.on("disconnect", function(){
	    console.log("DISCONNECTED");
		lcd.clear().cursor(0,0).print("DISCONNECTED");
	});

	socket.on('connect', function() {
		lcd.clear().cursor(0,0).print("CONNECTED");
	    console.log('Connected!');
	    socket.emit('camConnected');


	});

});

