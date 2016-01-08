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
	pir.on("high", function(e){
		console.log("high", e);
	});

	pir.on("low", function(e){
		console.log("low", e);
	});
});