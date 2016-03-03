var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

	i2cWrite(8, 0x12, 0x04, 0x99, 0xF2);


});
