var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

	console.log("Ready");

	var options = {
		address: 2
	};

	board.io.i2cConfig(options);

 
  var barometer = new five.Barometer({
    controller: "BMP180"
  });

  barometer.on("change", function() {
    console.log("barometer");
    console.log("  pressure     : ", this.pressure);
    console.log("--------------------------------------");
  });


 });

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log("ERROR: ", err);
})





