// Node.js modules
// 11.7 = 64%
// 11.46 = 41%

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
	setInterval(function(){
		programs.runForward();
	},200);
}	
