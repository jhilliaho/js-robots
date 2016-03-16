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

	socket.once('connect', function() {
	    console.log('Connected to server');
		var options = {
			address: 2
		};

		var temperature = 0;
		var humidity = 0;
		var pir = 0;

		board.io.i2cConfig(options);

		var motionDetected = false;



		var dataCounter = 1000;

		var readNano = function readNao() {
			board.io.i2cReadOnce(0x8, 6, function(data){
				console.log(dataCounter++);

				temperature = (data[0] + (data[1] << 8)) / 10;
				humidity = (data[2] + (data[3] << 8)) / 10;
				pir = data[4];

				if (pir) {
					motionDetected = true;
				}

				if (dataCounter >= 12) {
					dataCounter = 0;
					var newData = {temperature: temperature, humidity: humidity, pir: motionDetected};
					motionDetected = false;
					console.log("Sending data: ", newData);
					socket.emit("newData", newData);
				}
			})	
		}
		setInterval(readNano, 500);	
	});
});







