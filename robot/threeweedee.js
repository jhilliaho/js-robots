var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
	
function random (low, high) {
    return Math.round(Math.random() * (high - low) + low);
}

board.on("ready", function() {

	board.io.i2cConfig(options);

	var motor1 = {
		dir: 1,
		speed: 250
	}

	var motor2 = {
		dir: 1,
		speed: 0
	}

	var motor3 = {
		dir: 0,
		speed: 250
	}

	var options = {
		address: 2
	};

	var sendMotorSpeeds = function sendMotorSpeeds() {
		if (motor1.speed > 255) {motor1.speed = 255;}
		if (motor2.speed > 255) {motor2.speed = 255;}
		if (motor3.speed > 255) {motor3.speed = 255;}
		var bytes = [motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir];
		board.io.i2cWrite(0x8, bytes);
		console.log("Sent", motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir);
	}

	var calcMotorSpeeds = function calcMotorSpeeds() {

		motor1.dir = random(1,1);
		motor2.dir = random(1,1);
		motor3.dir = random(1,1);

		motor1.speed = random(250,250);
		motor2.speed = random(250,250);
		motor3.speed = random(250,250);
		sendMotorSpeeds();
	}
	calcMotorSpeeds();
	setInterval(calcMotorSpeeds, 5000);	

});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})




