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

 
  var compass = new five.Compass({
    controller: "HMC5883L"
  });

  compass.on("change", function() {
    console.log("change");
    console.log("  heading : ", Math.floor(this.heading));
    console.log("  bearing : ", this.bearing.name);
    console.log("--------------------------------------");
  });

  compass.on("data", function() {
    console.log("  heading : ", Math.floor(this.heading));
    console.log("  bearing : ", this.bearing.name);
    console.log("--------------------------------------");
  });


 });

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log("ERROR: ", err);
})





