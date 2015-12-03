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

	console.log(pir);

	pir.query(function(state) {
	  console.log(state);
	});

	pir.high(function(value) {
		console.log("1", value);
	});



	pir.read(function(value) {
		console.log("3", value);
	});

	pir.on("high", function(e){
		console.log("4", e);
	})

});