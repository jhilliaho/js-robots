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


  imu.on("change", function() {
/*

     console.log("temperature");
    console.log("  celsius      : ", this.temperature.celsius);
    console.log("  fahrenheit   : ", this.temperature.fahrenheit);
    console.log("  kelvin       : ", this.temperature.kelvin);
    console.log("--------------------------------------");

    console.log("accelerometer");
    console.log("  x            : ", this.accelerometer.x);
    console.log("  y            : ", this.accelerometer.y);
    console.log("  z            : ", this.accelerometer.z);
    console.log("  pitch        : ", this.accelerometer.pitch);
    console.log("  roll         : ", this.accelerometer.roll);
    console.log("  acceleration : ", this.accelerometer.acceleration);
    console.log("  inclination  : ", this.accelerometer.inclination);
    console.log("  orientation  : ", this.accelerometer.orientation);
    console.log("--------------------------------------");
*/
    console.log("  pitch : ", this.gyro.pitch, "  roll : ", this.gyro.roll, "  yaw : ", this.gyro.yaw);
  });

imu.gyro.recalibrate();


});

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log("ERROR: ", err);
})





