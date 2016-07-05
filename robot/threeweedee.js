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

	// 1 = clockwise
	// 0 = counterclockwise

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
		board.io.i2cConfig();
	
		if (motor1.speed > 255) {motor1.speed = 255;}
		if (motor2.speed > 255) {motor2.speed = 255;}
		if (motor3.speed > 255) {motor3.speed = 255;}
		var bytes = [motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir];
		var bytes2 = [random(0,1), random(0,1), random(0,1)];

		try {
			board.io.i2cWrite(0x8, bytes);
			board.io.i2cWrite(0x9, bytes2);
		} catch (ex) {
    		console.log("ERROR IN I2C WRITING", ex);
    		console.log("TRIED TO WRITE ", bytes);
			board.io.i2cConfig();
		}



	}

	var calcMotorSpeeds = function calcMotorSpeeds(rawAngle, rawSpeed, xPos) {

		angle = Math.round(rawAngle/30)*30;
		while (angle >= 360) {angle -= 360;}

		console.log("Calculating motor speed for ", rawAngle, angle);

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
			motor2.speed = 5;
			motor3.speed = 5;				
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

		motor1.speed *= (rawSpeed/10);
		motor2.speed *= (rawSpeed/10);	
		motor3.speed *= (rawSpeed/10);

		if (motor1.dir == 0) {
			motor1.speed -= xPos;
		} else {
			motor1.speed += xPos;			
		}

		if (motor2.dir == 0) {
			motor2.speed -= xPos;
		} else {
			motor2.speed += xPos;			
		}

		if (motor3.dir == 0) {
			motor3.speed -= xPos;
		} else {
			motor3.speed += xPos;			
		}

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
			else {motor1.dir = 0;}
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
		if (data.speed1 == 0 && data.x2 == 0) {
			stopMotors();
		}
		else {
			calcMotorSpeeds(data.angle1, data.speed1, data.x2);
		}

	});

	socket.once('connect', function() {
	    console.log('Connected to server');
	});

	stopMotors();

});



process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
    return true;
})




