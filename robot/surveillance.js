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

		board.io.i2cConfig(options);

		var lastData = [0,0,0]

		var sendState = function sendState(data){

			var temperature = (data[0] + (data[1] << 8)) / 10;
			var humidity = (data[2] + (data[3] << 8)) / 10;

			var newData = [temperature, humidity];

			if (temperature == 0 && humidity == 0) {
				return;
			}

			console.log("Sending data: ", newData, ",   first data: ", data);
			socket.emit("newData", newData);
		}

		var sendPullUp = function sendPullUp(count) {
			console.log("Sending pull-up!", count);
			socket.emit("newPullUp", count);
		}

		var dataCounter = 1000;

		var readNano = function readNano() {
			board.io.i2cReadOnce(0x8, 5, function(data){
				console.log(dataCounter++);

				var pullUps = data[data.length-1];
				if (pullUps) {
					sendPullUp(pullUps);
				}

				if (dataCounter >= 6) {
					dataCounter = 0;
					sendState(data);
				}
			})	
		}
		setInterval(readNano, 500);	
	});
});
