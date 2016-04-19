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
		pin: 'GPIO2',
		type: "digital"
	});
	console.log(1);

	var IN2 = new five.Pin({
		pin: 'GPIO4',
		type: "digital"
	});
	console.log(1);

	var IN3 = new five.Pin({
		pin: 'GPIO5',
		type: "digital"
	});
	console.log(1);

	var IN4 = new five.Pin({
		pin: 'GPIO6',
		type: "digital"
	});

	
	IN1.off();
	IN2.off();
	IN3.off();
	IN4.off();

	var date = 0;

for (var i = 0; i < 4; ++i) {
    IN1.off();
    IN2.on();
    IN3.off();
    IN4.on();

	date = Date.now()+150;
	while (Date.now() < date) {} 




    IN2.off();
    IN1.on();
    IN3.off();
    IN4.on();

	date = Date.now()+150;
	while (Date.now() < date) {} 




    IN2.off();
    IN1.on();
    IN4.off();
    IN3.on();

	date = Date.now()+150;
	while (Date.now() < date) {} 



    IN1.off();
    IN2.on();
    IN4.off();
    IN3.on();

	date = Date.now()+150;
	while (Date.now() < date) {} 
}

	console.log("Shut down");

	ENA.off();
	ENA.brightness(0);
	ENB.off();
	ENB.brightness(0);
	
	IN1.off();
	IN2.off();
	IN3.off();
	IN4.off();






	



});




process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})





