var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

  board.io.i2cWrite(0x08, 0x5, 0x12, 0xF1, 0x1F);


});
