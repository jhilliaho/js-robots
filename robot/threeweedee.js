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
		pin: "GPI12",
		type: "digital"
	});
	console.log(1);

	var IN2 = new five.Pin({
		pin: "GPI13",
		type: "digital"
	});
	console.log(1);

	var IN3 = new five.Pin({
		pin: "GPIO16",
		type: "digital"
	});
	console.log(1);

	var IN4 = new five.Pin({
		pin: "GPIO26",
		type: "digital"
	});

	
	IN1.low();
	IN2.low();
	IN3.low();
	IN4.low();

	var date = 0;

for (var i = 0; i < 4; ++i) {
    IN1.low();
    IN2.high();
    IN3.low();
    IN4.high();

	date = Date.now()+150;
	while (Date.now() < date) {} 




    IN2.low();
    IN1.high();
    IN3.low();
    IN4.high();

	date = Date.now()+150;
	while (Date.now() < date) {} 




    IN2.low();
    IN1.high();
    IN4.low();
    IN3.high();

	date = Date.now()+150;
	while (Date.now() < date) {} 



    IN1.low();
    IN2.high();
    IN4.low();
    IN3.high();

	date = Date.now()+150;
	while (Date.now() < date) {} 
}

	console.log("Shut down");

	
	IN1.low();
	IN2.low();
	IN3.low();
	IN4.low();






	



});




process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})





