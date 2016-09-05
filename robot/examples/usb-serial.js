// Example of reading serial port using Node.js
//
// Jani Hilliaho 2016

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

var SerialPort = require("serialport");

board.on("ready", function() {

	var range = 0;
	var port = new SerialPort("/dev/ttyUSB0", {
	  baudRate: 115200,
	  parser: com.parsers.readline('\r\n')
	});

	port.on('open', function() {
		console.log("Open");
		port.on('data', function (num) {
			console.log("RANGE", num.toString());
		});
	});	
});