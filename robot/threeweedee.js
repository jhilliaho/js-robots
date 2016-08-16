var moving = require("./threeweedee_moving.js");
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

var io = require('socket.io-client');

board.on("ready", function() {
	board.io.i2cConfig();

	var imu = new five.IMU({
		controller: "MPU6050"
	});

	imu.on("change", function() {
	    console.log("  roll         : ", this.gyro.roll);
   	});


	var motor1 = {};
	var motor2 = {};
	var motor3 = {};

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
	
		motor1.speed = Math.round(motor1.speed);
		motor2.speed = Math.round(motor2.speed);
		motor3.speed = Math.round(motor3.speed);

		motor1.speed = motor1.speed > 255 ? 255 : motor1.speed
		motor1.speed = motor1.speed < 0 ? 0 : motor1.speed

		motor2.speed = motor2.speed > 255 ? 255 : motor2.speed
		motor2.speed = motor2.speed < 0 ? 0 : motor2.speed

		motor3.speed = motor3.speed > 255 ? 255 : motor3.speed
		motor3.speed = motor3.speed < 0 ? 0 : motor3.speed

		var bytes = [motor1.speed, motor1.dir, motor2.speed, motor2.dir, motor3.speed, motor3.dir];

		console.log("Sending ", bytes);

		try {
			board.io.i2cWrite(0x8, bytes);
		} catch (ex) {
    		console.log("ERROR IN I2C WRITING", ex);
			board.io.i2cConfig();
		}
	}

	var calcMotorSpeeds = function calcMotorSpeeds(rawAngle, speed, rotation) {

		rawAngle = parseInt(rawAngle);
		speed = parseInt(speed)*4;
		rotation = parseInt(rotation);

		// Angle as degrees
		var motorArr = moving.calculateRelativeMotorSpeeds(rawAngle);
		
		motorArr[0] *= speed; //3
		motorArr[1] *= speed; //2
		motorArr[2] *= speed; //1

		motorArr[0] += rotation/2;
		motorArr[1] += rotation/2;
		motorArr[2] += rotation/2;

		motorArr[1] /= 2;

		console.log(motorArr);

		motor1 = {
			speed: Math.round(Math.abs(motorArr[0])),
			dir: motorArr[0] > 1 ? 1 : 0
		};
		motor2 = {
			speed: Math.round(Math.abs(motorArr[1])),
			dir: motorArr[1] > 1 ? 1 : 0
		};
		motor3 = {
			speed: Math.round(Math.abs(motorArr[2])),
			dir: motorArr[2] > 1 ? 1 : 0
		};

		console.log("M1: ", motor1);
		console.log("M2: ", motor2);
		console.log("M3: ", motor3);

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




