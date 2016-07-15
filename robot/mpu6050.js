var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  var imu = new five.IMU({
    controller: "MPU6050"
  });

  imu.on("change", function() {
    console.log("GYRO: Pitch, Roll, Yaw  ", this.gyro.pitch, this.gyro.roll, this.gyro.yaw);

  });

});