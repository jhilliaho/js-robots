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

	var readNano = function readNano() {
  		board.io.i2cWrite(0x8, 'hello');
  		console.log("Wrote");
	}

	setInterval(readNano, 1000	);	

});


 