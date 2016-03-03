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

	board.io.i2cWrite(8, [61,62,63,64,65,66]);

	board.io.i2cRead(0x8, 6, function(data){
		var string = new Buffer(data).toString('ascii');

		console.log("got ", string);
	})
});
