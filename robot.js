console.log("Starting the system...");

// WebSocket library
var io = require('socket.io-client');

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
	io: new Raspi()
});

board.on("ready", function() {

	///////////////////////
	///	  MOTOR SPEED	///
	///////////////////////

	var rightMotor = new five.Motor({
		pins: {
			pwm: "GPIO19",
			dir: "GPIO18",
			cdir: "GPIO23"  
		}
	});

	var leftMotor = new five.Motor({
		pins: {
			pwm: "GPIO12",
			dir: "GPIO24",
			cdir: "GPIO25"  
		}
	});

	leftMotor.reverse(120);
	rightMotor.reverse(120);

	///////////////////////
	///		ENCODERS	///
	///////////////////////

	var rightTicks = 0;
	var leftTicks = 0;

	// PIN OPERATIONS
	var rightGearTick = new five.Pin({
		pin: "GPIO17",
		type: "digital",
		mode: 0
	});

	// PIN OPERATIONS
	var leftGearTick = new five.Pin({
		pin: "GPIO4",
		type: "digital",
		mode: 0
	});

	function rightTick(val) {
		++rightTicks;
		if (rightTicks > 30) {
			rightMotor.stop();
			console.log("right stop");
		}
		console.log(leftTicks, " : ", rightTicks);
	};

	function leftTick(val) {
		++leftTicks;
		if (leftTicks > 30) {
			leftMotor.stop();
			console.log("left stop");
		}
		console.log(leftTicks, " : ", rightTicks);
	};

	rightGearTick.on("high", function(e){
		rightTick(1);
	});

	rightGearTick.on("low", function(e){
		rightTick(0);
	});

	leftGearTick.on("high", function(e){
		leftTick(1);
	});

	leftGearTick.on("low", function(e){
		leftTick(0);
	});

	console.log("Board ready");

	// SOCKET.IO
	var socket = io.connect('http://46.101.48.115:8080', {reconnect: true});

	socket.on("disconnect", function(){
		console.log("DISCONNECTED");
	});

	socket.on('connect', function() {
		console.log('Connected!');
		socket.emit('camConnected');
	});

});

