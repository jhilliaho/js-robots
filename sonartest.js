var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
    var ping = new five.Ping("GPIO4");
    ping.on("change", function( err, value ) {
        console.log('Distance: ' + this.cm + ' cm');
    });
});