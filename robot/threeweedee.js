var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
	
board.on("ready", function() {

	board.io.i2cConfig(options);

	var motor1 = {
		dir: 0,
		speed: 40
	}

	var motor2 = {
		dir: 1,
		speed: 120
	}

	var motor3 = {
		dir: 1,
		speed: 200
	}

	var options = {
		address: 2
	};

	var readNano = function readNano() {
		var str = "";
		str += "X" + motor1.dir + motor1.speed;
		str += "Y" + motor2.dir + motor2.speed;
		str += "Z" + motor3.dir + motor3.speed;

		var bytes = [];
		for (var i = 0; i < str.length; ++i) {
		    bytes.push(str.charCodeAt(i));
		}
		board.io.i2cWrite(0x8, bytes);
		console.log("Sent ", str);
	}
	setInterval(readNano, 2000	);	
});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})





