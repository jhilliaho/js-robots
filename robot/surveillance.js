var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

var temperature = 0;
var humidity = 0;
var pir = 0;
var volume = 0;
var lightness = 0;
var sendDataInterval = 60;
var pirVal = 0;
var maxVolume = 0;
var sendCounter = 1;
var dataCounter = sendDataInterval;

board.on("ready", function() {
	console.log("connecting");
	
	var socket = require('socket.io-client')('http://46.101.79.118:3000');

	socket.on("disconnect", function(){
	    console.log("Disconnected from server");
	});

	socket.on("input1DataFromBrowser", function(data){
		console.log("Got new interval, ", data);
		sendDataInterval = data;
	});

	socket.once('connect', function() {
	    console.log('Connected to server');
		var options = {
			address: 2
		};

		board.io.i2cConfig(options);

		var readNano = function readNano() {
			//  byte arr[9] = {temp1, temp2, hum1, hum2, pirData, volumeDiff1, volumeDiff2, lightness1, lightness2};

			board.io.i2cReadOnce(0x8, 9, function(data){
				console.log(dataCounter++);

				temperature = (data[0] + (data[1] << 8)) / 10;
				humidity = (data[2] + (data[3] << 8)) / 10;
				pir = data[4];
				volume = data[5] + (data[6] << 8);
				lightness = data[7] + (data[8] << 8);

				if (volume > maxVolume) {
					maxVolume = volume;
				}

				if (pir) {
					pirVal = 1;
				}

				if (sendCounter > 60) {
					sendCounter = 1;
				}


				if (dataCounter >= sendDataInterval) {
					var newData = {
						temperature: temperature,
						humidity: humidity,
						pir: pirVal,
						volume: maxVolume,
						lightness: lightness,
						dataCounter: sendCounter
					};

					console.log("Send data: ", newData);

					socket.emit("newData", newData);
					sendCounter++;
					pirVal = 0;
					maxVolume = 0;
					dataCounter = 0;
				}
			});
		}
		setInterval(readNano, 100);	
	});
});

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log("ERROR: ", err);
})





