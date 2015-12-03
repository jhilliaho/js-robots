var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
	var pir = new five.Pin({
		pin: "P1-13",
		mode: 0
	});

	pir.query(function(state) {
	  console.log(state);
	});

	pir.read(function(error, value) {
		console.log(error, value);
	});

});