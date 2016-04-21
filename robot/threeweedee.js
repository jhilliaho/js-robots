var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

	var options = {
		address: 2
	};

	board.io.i2cConfig(options);

	console.log(1);
	var IN1 = new five.Pin({
		pin: "P1-11",
		type: "digital"
	});
	console.log(1);

	var IN2 = new five.Pin({
		pin: "P1-13",
		type: "digital"
	});
	console.log(1);

	var IN3 = new five.Pin({
		pin: "P1-15",
		type: "digital"
	});
	console.log(1);

	var IN4 = new five.Pin({
		pin: "P1-16",
		type: "digital"
	});

	var ENA = new five.Pin({
		pin: "P1-18",
		type: "digital"
	});
	
	IN1.low();
	IN2.low();
	IN3.low();
	IN4.low();
	ENA.high();


//1
    IN1.low();
    IN2.high();
    IN3.low();
    IN4.high();
//2
    IN2.low();
    IN1.high();
    IN3.low();
    IN4.high();
//3
    IN2.low();
    IN1.high();
    IN4.low();
    IN3.high();
//4
    IN1.low();
    IN2.high();
    IN4.low();
    IN3.high();

	console.log("Shut down");

	
	IN1.low();
	IN2.low();
	IN3.low();
	IN4.low();
	ENA.low();






	



});




process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})





