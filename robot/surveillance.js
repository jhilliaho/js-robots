var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
	
board.on("ready", function() {
	var options = {
		address: 2
	};
	board.io.i2cConfig(options);

	var lastData = [0,0,0]

	var sendState = function sendState(data){
		console.log("Sending data: ", data);
	}

	var sendPullUp = function sendPullUp(count) {
		console.log("Sending pull-up!", count);
	}

	var dataCounter = 0;

	var readNano = function readNano() {
		board.io.i2cReadOnce(0x8, 3, function(data){
			dataCounter++;

			var pullUps = data[data.length-1];
			if (pullUps) {
				sendPullUp(pullUps);
			}

			if (dataCounter >= 10) {
				dataCounter = 0;
				sendState(data);
			}
		})	
	}

	setInterval(readNano, 1000	);	

});
