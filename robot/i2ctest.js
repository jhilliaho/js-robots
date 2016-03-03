var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

function toArr(string) {
	var bytes = [];
	for (var i = 0; i < string.length; ++i) {
	    bytes.push(string.charCodeAt(i));
	}
	return bytes;
}

board.on("ready", function() {
	var options = {
		address: 1
	};
	board.io.i2cConfig(options);

	var arr = toArr("Moi, miten menee?");

	board.io.i2cWrite(8, arr);

	board.io.i2cReadOnce(0x8, 16, function(data){
		var string = new Buffer(data).toString('ascii');

		console.log("got ", string);
	})
});
