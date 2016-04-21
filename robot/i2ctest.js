var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
	
board.on("ready", function() {
  this.i2cConfig();
  this.i2cWrite(0x08, 0x00, 0x7e);
  this.i2cWrite(0x08, 0x00, 0x7e);
  this.i2cWrite(0x08, 0x00, 0x7e);
  this.i2cWrite(0x08, 0x00, 0x7e);
  this.i2cWrite(0x08, 0x00, 0x7e);
  this.i2cWrite(0x08, 0x00, 0x7e);
  console.log("Done");
});

