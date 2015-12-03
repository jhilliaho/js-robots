var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
	var pir = new five.Pin("P1-13");

	pir.high(function(error, value) {
		console.log(error, value);
	});

});