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

  var imu = new five.IMU({
    controller: "MPU6050"
  });



imu.gyro.recalibrate();

setInterval(function(){
    console.log("  pitch        : ", imu.gyro.pitch);
    console.log("  roll         : ", imu.gyro.roll);
    console.log("  yaw          : ", imu.gyro.yaw);
    console.log("--------------------------------------");
});

});

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log("ERROR: ", err);
})





