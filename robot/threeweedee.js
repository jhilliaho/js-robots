// Node.js modules
// 11.7 = 64%
// 11.46 = 41%
// 
// Luodaan robotista kauko-ohjattava siten, että sensoridata näkyy ohjatessa.
// Piirretään tutkagraafi etäisyysmittarista ja osoitetaan robotin asento
// 
// 
// 
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

// Own modules
var programs = require("./programs_module.js");
var sensors = require("./sensor_module.js");
var connection;

board.on("ready", function() {
	board.io.i2cConfig();
	sensors.activateModule(five, board);
	programs.activateModule(board);
	console.log(sensors.moduleState);
	setTimeout(run, 500);
});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
    return true;
});

function run() {

	connection = require("./connection_module.js");

}	
