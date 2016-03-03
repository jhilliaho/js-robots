var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
	var options = {
		address: 1
	};
	board.io.i2cConfig(options);

	board.io.i2cWrite(8, [65,66,67,68,69,70,71,72]);

	board.io.i2cRead(0x8, 6, function(data){
		var string = new Buffer(data).toString('ascii');

		console.log("got ", string);
	})
});
