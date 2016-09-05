// Node.js modules
var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
var SerialPort = require("serialport");

// Own modules
var moving = require("./moving_module.js");
var connection = require("./connection_module.js");
var sensors = require("./sensor_module.js");

// Global variables
var distances = [];
var radaring = false;
var rollAngle = 0;
var startTime = Date.now();
var range = 0;
var data = {};
data.angle1 = data.speed1 = data.x2 = 0;

// Motor functions
var motor1 = {};
var motor2 = {};
var motor3 = {};

// Global objects
var lidar = new SerialPort("/dev/ttyUSB0", {baudRate: 115200});
var imu = new five.IMU({controller: "MPU6050"});
var compass = new five.Compass({controller: "HMC5883L"});		

// Event handlers
lidar.on('data', function (num) {
	var val = parseInt(num.toString());
	if (radaring && !isNaN(val) && val >= 20) {
		distances[rollAngle] = parseInt(num.toString());
	}
});

compass.on("change", function() {
	rollAngle = this.bearing.heading;
	console.log(rollAngle);
});

board.on("ready", function() {
	onBoardReady();
});

imu.on("change", function() {
	var temp = this.gyro.roll.angle;
});



process.on('uncaughtException', function(err) {
    console.log("ERROR: ", err);
    return true;
})

function onBoardReady() {
	board.io.i2cConfig();

	board.io.i2cWrite(0x68, [0x37, 0x02, 0x6A, 0x00, 0x6B, 0x00]);

	runProgram();

	setTimeout(function(){
		radar(function(){
			pointAngle(findLongestDirection(), function(){
				calcMotorSpeeds(0,10,0);
			});
		})
	}, 200);
}

function pointAngle(angle, callback) {
	var interval = setInterval(function(){
		console.log(rollAngle);
		var direction = 1;
		calcMotorSpeeds(0,0,100 * direction);
		if (rollAngle < (angle + 4) && rollAngle > (angle - 4)) {
			clearInterval(interval);
			console.log("ENd", rollAngle);
			callback();
		}
	},50);
}

function findLongestDirection() {
	var max = 0;
	var maxAngle = 0;
	console.log("Distances length:", distances.length);
	for (var i = 0; i < distances.length; ++i) {
		if (distances[i] > max) {
			max = distances[i];
			maxAngle = i;
		}
	}
	console.log("Widest angle: ", max, " at ", maxAngle);
	maxAngle -= 120;
	maxAngle = maxAngle < 0 ? maxAngle+360 : maxAngle;
	return maxAngle;
}

function radar(callback){
	pointAngle(0, function(){
		radaring = true;
		pointAngle(180, function(){
			pointAngle(0, function(){
				radaring = false;
				console.log(distances);
				calcMotorSpeeds(0,0,0);
				callback();
			});
		});
	});
}





