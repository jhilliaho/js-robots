var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

var io = require('socket.io-client');
	
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

		while (angle >= 360) {angle -= 360;}

		if (angle == 0) {
			motor1.dir = 1;
			motor2.dir = 0;
			motor3.dir = 0;

			motor1.speed = 10;
			motor2.speed = 0;
			motor3.speed = 10;				
		}

		if (angle == 30) {
			motor1.dir = 1;
			motor2.dir = 0;
			motor3.dir = 0;

			motor1.speed = 10;
			motor2.speed = 5;
			motor3.speed = 5;				
		}

		if (angle == 60) {
			motor2.dir = 0;
			motor3.dir = 1;
			motor1.dir = 1;

			motor2.speed = 10;
			motor3.speed = 0;
			motor1.speed = 10;		
		}

		if (angle == 90) {
			motor2.dir = 0;
			motor3.dir = 1;
			motor1.dir = 1;

			motor2.speed = 10;
			motor3.speed = 5;
			motor1.speed = 5;				
		}

		if (angle == 120) {

			motor3.dir = 1;
			motor1.dir = 0;
			motor2.dir = 0;

			motor3.speed = 10;
			motor1.speed = 0;
			motor2.speed = 10;		
		}

		if (angle == 150) {
			motor3.dir = 1;
			motor1.dir = 0;
			motor2.dir = 0;

			motor3.speed = 10;
			motor1.speed = 5;
			motor2.speed = 5;				
		}

		if (angle == 180) {
			motor1.dir = 0;
			motor2.dir = 1;
			motor3.dir = 1;

			motor1.speed = 10;
			motor2.speed = 0;
			motor3.speed = 10;				
		}

		if (angle == 210) {
			motor1.dir = 0;
			motor2.dir = 1;
			motor3.dir = 1;

			motor1.speed = 10;
			motor2.speed = 50;
			motor3.speed = 50;				
		}

		if (angle == 240) {
			motor2.dir = 1;
			motor3.dir = 0;
			motor1.dir = 0;

			motor2.speed = 10;
			motor3.speed = 0;
			motor1.speed = 10;		
		}

		if (angle == 270) {
			motor2.dir = 1;
			motor3.dir = 0;
			motor1.dir = 0;

			motor2.speed = 10;
			motor3.speed = 5;
			motor1.speed = 5;				
		}

		if (angle == 300) {
			motor3.dir = 0;
			motor1.dir = 1;
			motor2.dir = 1;

			motor3.speed = 10;
			motor1.speed = 0;
			motor2.speed = 10;		
		}

		if (angle == 330) {
			motor3.dir = 0;
			motor1.dir = 1;
			motor2.dir = 1;

			motor3.speed = 10;
			motor1.speed = 5;
			motor2.speed = 5;				
		}

		sendMotorSpeeds();

	}

	console.log("connecting");
	
	var socket = require('socket.io-client')('http://46.101.79.118:3000');

	socket.on("disconnect", function(){
	    console.log("Disconnected from server");
	});

	socket.on("input1DataFromBrowser", function(data){
		console.log("Got new interval, ", data);
		sendDataInterval = data;
	});

	socket.once('connect', function() {
	    console.log('Connected to server');
		var options = {
			address: 2
		};
	});

	stopMotors();

});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})




