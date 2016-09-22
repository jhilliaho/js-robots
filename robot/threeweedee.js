// Node.js modules
// 11.7 = 64%
// 11.46 = 41%
// 
// Luodaan robotista kauko-ohjattava siten, että sensoridata näkyy ohjatessa.
// Piirretään tutkagraafi etäisyysmittarista ja osoitetaan robotin asento
// 
// 

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

// Own modules
var programs = require("./programs_module.js");

board.on("ready", function() {
	board.io.i2cConfig();
	programs.activateModule(board);
	setTimeout(run, 500);
});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
    return true;
});

function run() {
	programs.runForward();
}	
