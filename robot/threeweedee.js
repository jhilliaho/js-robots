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
		console.log("Stopping motors");
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
		//console.log("Sent", motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir);
	}

	var calcMotorSpeeds = function calcMotorSpeeds(angle, speedMultiplier) {


		console.log("Calculating motor speed for ", angle);

		motor1.dir = 0;
		motor2.dir = 0;
		motor3.dir = 0;

		motor1.speed = -10;
		motor2.speed = 0;
		motor3.speed = 20;				

		motor1.speed *= speedMultiplier;
		motor2.speed *= speedMultiplier;
		motor3.speed *= speedMultiplier;

		motor1.speed += (angle-180)/6;
		motor2.speed += (angle-180)/6;
		motor3.speed += (angle-180)/6;

		if (motor1.speed < 0) {
			if (motor1.dir == 0) {motor1.dir = 1;}
			else {motor1.dir = 0;}
			motor1.speed = Math.abs(motor1.speed);
		}

		if (motor2.speed < 0) {
			if (motor2.dir == 0) {motor2.dir = 1;}
			else {motor2.dir = 0;}
			motor2.speed = Math.abs(motor2.speed);
		}

		if (motor3.speed < 0) {
			if (motor3.dir == 0) {motor3.dir = 1;}
			else {motor3.dir = 0;}
			motor3.speed = Math.abs(motor3.speed);
		}

		sendMotorSpeeds();

	}

	console.log("connecting");
	
	var socket = require('socket.io-client')('http://46.101.79.118:3000');

	socket.on("disconnect", function(){
	    console.log("Disconnected from server");
	});

	socket.on("speedAndAngleFromServer", function(data){
		if (data.speed1 == 0) {
			stopMotors();
		}
		else {
			calcMotorSpeeds(data.angle1, data.speed1/4);
		}

	});

	socket.once('connect', function() {
	    console.log('Connected to server');
	});

	stopMotors();

});

process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
})




