var five = require("johnny-five");
var Raspi = require("raspi-io");

var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

	console.log("Board ready");

	var sp = require("serialport")

	sp.list(function (err, ports) {
	  ports.forEach(function(port) {
	    console.log(port.comName);
	  });
	});


	var SerialPort = sp.SerialPort;
	var serialPort = new SerialPort("/dev/ttyAMA0", {
	  baudrate: 9600
	}); 


	serialPort.on("open", function () {
	  console.log('serial open');
	  serialPort.on('data', function(data) {
	    console.log('data received: ' + data);
	  });
	  serialPort.write("ls\n", function(err, results) {
	    console.log('err ' + err);
	    console.log('results ' + results);
	  });
	});



});