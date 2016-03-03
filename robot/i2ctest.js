var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

  board.io.i2cWrite(0x8, 0x41);
  board.io.i2cWrite(0x8, 0x42);
  board.io.i2cWrite(0x8, 0x43);
  board.io.i2cWrite(0x8, 0x44);


});
