var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

var SerialPort = require("serialport");

board.on("ready", function() {

	var range = 0;
	var lidar = new SerialPort("/dev/ttyUSB0", {
	  baudRate: 115200
	});


	lidar.on('open', function() {
		console.log("Open");
		lidar.on('data', function (num) {
			console.log("RANGE", num);
		});
	});	

});