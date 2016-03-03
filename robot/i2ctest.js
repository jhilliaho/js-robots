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

	board.io.i2cWrite(0x8, 0x41);

	board.io.i2cRead(0x8, 6, function(data){
		console.log("got ", new Buffer(data).toString('ascii'));
);
	})



});
