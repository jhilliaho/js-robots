var five = require("johnny-five");
var Raspi = require("raspi-io");

var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

	console.log("Board ready");

	var sp = require("serialport")
	var SerialPort = sp.SerialPort
	var serialPort = new SerialPort("/dev/ttyAMA0", {
	  baudrate: 9600,
	  parser: sp.parsers.readline("\n")
	}); 


	serialPort.on("open", function () {
	  console.log('serial open');
	  serialPort.on('data', function(data) {
	    console.log('data received: ' + data);
	  });
	});



});