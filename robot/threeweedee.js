var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
	
board.on("ready", function() {

	board.io.i2cConfig(options);

	var motor1 = {
		dir: 0,
		speed: 0
	}

	var motor2 = {
		dir: 1,
		speed: 0
	}

	var motor3 = {
		dir: 1,
		speed: 0
	}

	var options = {
		address: 2
	};

	var readNano = function readNano() {
		var str = "";

		var bytes = [motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir];

		board.io.i2cWrite(0x8, bytes);
		console.log("Sent", str);
	}
	setInterval(readNano, 2000	);	
});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})




