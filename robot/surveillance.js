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

		var readNano = function readNano() {
			//  byte arr[9] = {temp1, temp2, hum1, hum2, pirData, volumeDiff1, volumeDiff2, lightness1, lightness2};

			board.io.i2cReadOnce(0x8, 9, function(data){
				console.log(dataCounter++);

				temperature = (data[0] + (data[1] << 8)) / 10;
				humidity = (data[2] + (data[3] << 8)) / 10;
				pir = data[4];
				volume = data[5] + (data[6] << 8);
				lightness = data[7] + (data[8] << 8);

				if (pir) {
					motionDetected = true;
				}

				if (dataCounter >= 12) {
					dataCounter = 0;
					var pirVal;
					if (motionDetected) {
						pirVal = 1;
					} else {
						pirVal = 0;
					}
					var newData = {temperature: temperature, humidity: humidity, pir: pirVal, volume: volume, lightness: lightness};
					motionDetected = false;
					console.log("Sending data: ", newData);
					socket.emit("newData", newData);
				}
			});
		}
		setInterval(readNano, 500);	
	});
});

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log("ERROR: ", err);
})





