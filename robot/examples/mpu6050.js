// Example of using MPU6050 IMU on GY-87 board
//
// Jani Hilliaho 2016

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  var imu = new five.IMU({
    controller: "MPU6050"
  });

	imu.calibrate();


  imu.on("change", function() {

    console.log("  yaw          : ", this.gyro.yaw);

  });

});