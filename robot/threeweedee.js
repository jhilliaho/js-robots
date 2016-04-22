var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
	
function random (low, high) {
    return Math.round(Math.random() * (high - low) + low);
}

board.on("ready", function() {

	// 1 = myötäpäivään
	// 0 = vastapäivään

	board.io.i2cConfig(options);

	var motor1 = {
		dir: 0,
		speed: 10
	}

	var motor2 = {
		dir: 0,
		speed: 10
	}

	var motor3 = {
		dir: 0,
		speed: 10
	}

	var options = {
		address: 2
	};

	var stopMotors = function stopMotors(){
		motor1.dir = 0;
		motor2.dir = 0;
		motor3.dir = 0;
		motor1.speed = 0;
		motor2.speed = 0;
		motor3.speed = 0;	
		sendMotorSpeeds();		
	}

	var sendMotorSpeeds = function sendMotorSpeeds() {
		if (motor1.speed > 255) {motor1.speed = 255;}
		if (motor2.speed > 255) {motor2.speed = 255;}
		if (motor3.speed > 255) {motor3.speed = 255;}
		var bytes = [motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir];
		board.io.i2cWrite(0x8, bytes);
		console.log("Sent", motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir);
	}

	var calcMotorSpeeds = function calcMotorSpeeds(angle) {

		if (angle == 0) {
			motor1.dir = 1;
			motor2.dir = 0;
			motor3.dir = 0;

			motor1.speed = 100;
			motor2.speed = 0;
			motor3.speed = 100;				
		}
		if (angle == 120) {

			motor3.dir = 1;
			motor1.dir = 0;
			motor2.dir = 0;

			motor3.speed = 100;
			motor1.speed = 0;
			motor2.speed = 100;		
		}
		if (angle == 240) {
			motor2.dir = 1;
			motor3.dir = 0;
			motor1.dir = 0;

			motor2.speed = 100;
			motor3.speed = 0;
			motor1.speed = 100;		
		}

		if (angle == 30) {
			motor1.dir = 1;
			motor2.dir = 0;
			motor3.dir = 0;

			motor1.speed = 50;
			motor2.speed = 100;
			motor3.speed = 100;				
		}


		sendMotorSpeeds();

	}

	setTimeout(function(){
		calcMotorSpeeds(30);
	}, 0);


	setTimeout(function(){
		stopMotors();
	}, 10000);

});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})




