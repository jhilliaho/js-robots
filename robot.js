console.log("Starting the system...");

// WebSocket library
var io = require('socket.io-client');

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

		var rightTicks = 0;
		var leftTicks = 0;

		// PIN OPERATIONS
		var rightGearTick = new five.Pin({
			pin: "GPIO4",
			type: "digital",
			mode: 0
		});

		// PIN OPERATIONS
		var leftGearTick = new five.Pin({
			pin: "GPIO17",
			type: "digital",
			mode: 0
		});

		rightGearTick.on("high", function(e){
			++rightTicks;
			console.log("right high", rightTicks);
		});

		rightGearTick.on("low", function(e){
			++rightTicks;
			console.log("right low", rightTicks);
		});

		leftGearTick.on("high", function(e){
			++leftTicks;
			console.log("left high", leftTicks);
		});

		leftGearTick.on("low", function(e){
			++leftTicks;
			console.log("left low", leftTicks);
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

