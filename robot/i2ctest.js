var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

  board.io.i2cWrite(0x8, 'h');	


for (var i = 0; i < 256; ++i) {
  board.io.i2cWrite(0x8, i);	
}



});
