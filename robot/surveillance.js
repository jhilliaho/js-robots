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
			console.log("Sending data: ", data);
			socket.emit("newData", data);
		}

		var sendPullUp = function sendPullUp(count) {
			console.log("Sending pull-up!", count);
			socket.emit("newPullUp", count);
		}

		var dataCounter = 1000;

		var readNano = function readNano() {
			board.io.i2cRead(0x8, 3, function(data){
				console.log(dataCounter++);

				var pullUps = data[data.length-1];
				if (pullUps) {
					sendPullUp(pullUps);
				}

				if (dataCounter >= 0) {
					dataCounter = 0;
					sendState(data);
				}
			})	
		}
		readNano();
	});
});
