var moving = require("./threeweedee_moving.js");
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

var SerialPort = require("serialport");

var io = require('socket.io-client');

board.on("ready", function() {
	board.io.i2cConfig();

	var distances = {};
	var radaring = false;
	var rollAngle = 0;

	var startTime = Date.now();

	// Laser distance meter
	var range = 0;
	var lidar = new SerialPort("/dev/ttyUSB0", {
	  baudRate: 115200
	});

	lidar.on('open', function() {
		lidar.on('data', function (num) {
			var val = parseInt(num.toString());
			if (radaring && !isNaN(val) && val >= 20) {
				distances[rollAngle] = parseInt(num.toString());
			}
		});
	});	

	// Gyroscopes
	var data = {};

	
	var imu = new five.IMU({
		controller: "MPU6050"
	});

	var compass = null;

	board.io.i2cWrite(0x68, [0x37, 0x02, 0x6A, 0x00, 0x6B, 0x00]);

	compass = new five.Compass({
		controller: "HMC5883L"
	});		

	compass.on("change", function() {
		rollAngle = this.bearing.heading;
	});




	// imu.on("change", function() {
		//rollAngle = this.gyro.roll.angle;
		//console.log(rollAngle);
   	// });

	// Motor functions
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


		try {
			board.io.i2cWrite(0x8, bytes);
		} catch (ex) {
    		console.log("ERROR IN I2C WRITING", ex);
			board.io.i2cConfig();
		}
	}

	var calcMotorSpeeds = function calcMotorSpeeds(rawAngle, speed, rotation) {


		rawAngle = parseInt(rawAngle);
		rawAngle -= rollAngle;
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

		sendMotorSpeeds();
	}

	console.log("connecting");
	
	var socket = require('socket.io-client')('http://46.101.79.118:3000');

	socket.on("disconnect", function(){
	    console.log("Disconnected from server");
	});

	socket.on("speedAndAngleFromServer", function(dat){
		data = dat;
	});

	data.angle1 = data.speed1 = data.x2 = 0;

	//var calcInterval = setInterval(function(){
	//	calcMotorSpeeds(data.angle1, data.speed1, data.x2);
	//}, 100);

	socket.once('connect', function() {
	    console.log('Connected to server');
	});

	stopMotors();

	runProgram();


	function pointAngle(angle, callback) {
		console.log("Execute radar");

		var interval = setInterval(function(){
			console.log(rollAngle);

			var direction = 1;

			calcMotorSpeeds(0,0,50 * direction);
			if (rollAngle < (angle + 4) && rollAngle > (angle - 4)) {
				clearInterval(interval);
				console.log("ENd", rollAngle);
				callback();
			}
		},50);
	}

	function findLongestDirection() {
		var max = 0;
		for (var i = 0; i < directions.length; ++i) {
			if (directions[i] > max) {
				max = directions[i];
			}
		}
		console.log("Widest angle: ", max);
		return max;
	}

	function radar(callback){
		pointAngle(0, function(){
			radaring = true;
			pointAngle(180, function(){
				pointAngle(0, function(){
					radaring = false;
					console.log(distances);
					calcMotorSpeeds(0,0,0);
				});
			});
		});
	}

	setTimeout(function(){
		radar(function(){
			pointAngle(findLongestDirection(), function(){
				calcMotorSpeeds(0,100,0);
			});
		})
	}, 200);

	function runProgram() {

	}

});



process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
    return true;
})




