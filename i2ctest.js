var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  var virtual = new five.Board.Virtual(
    new five.Expander("PCA9685")
  );
  
  var led = new five.Led({ pin: 0, board: virtual });
  led.pulse(1000);
});
