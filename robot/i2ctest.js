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

	board.io.i2cWrite(0x8, 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18);	

	i2cRead(address, numberOfBytesToRead, function(data){
		console.log("got ", data);
	})



});
