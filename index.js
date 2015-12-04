console.log("Starting the system...");

// File system module
var fs = require("fs");

// Raspicam module
var RaspiCam = require("raspicam");

// Initialize camera with Raspicam
var camera = new RaspiCam({
	mode: "photo",
	output: "./images/image_%06d.jpg", // image_000001.jpg, image_000002.jpg,...
	encoding: "png",
	rotation: 180
});

// WebSocket library
var io = require('socket.io-client');

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {

	console.log("Board ready");
	// Set LCD screen
	var lcd = new five.LCD({
		controller: "PCF8574AT",
		address: 0x27,
		rows: 2,
		cols: 16
	});

	lcd.clear();
	lcd.cursor(0, 0).print("Bleep");


	// Options object with pin property
	var pwm1 = new five.Led({
	  pin: "GPIO19"
	});

	var pwm2 = new five.Led({
	  pin: "GPIO12"
	});

	// SOCKET.IO
	var socket = io.connect('http://46.101.48.115:8080', {reconnect: true});

	socket.on("disconnect", function(){
	    console.log("disconnected");
		lcd.clear().cursor(0,0).print("DISCONNECTED");
	});

	socket.on('connect', function() {
		lcd.clear().cursor(0,0).print("CONNECTED");
	    console.log('Connected!');
	    socket.emit('camConnected');


		// PIN OPERATIONS
		var pir = new five.Pin({
			pin: "GPIO4",
			mode: 0
		});

		pir.on("high", function(e){
			console.log("high", e);
			camera.start();
		});

		pir.on("low", function(e){
			console.log("low", e);
			led.stop().off();			

		});

		camera.on("start", function( err, timestamp ){
			lcd.clear().cursor(0,0).print("TAKING PICTURE.");
			led.pulse(500);
			console.log("Shooting started at " + timestamp);
		});

		camera.on("read", function( err, timestamp, filename ){
			lcd.clear().cursor(0,0).print("TAKING PICTURE..");
			led.stop().off();			
		    if (filename.search("~") != -1) {
		        return;
		    }
		    
			console.log("Image captured with filename: " + filename);
			
		    fs.readFile("./images/" + filename, function(err, original_data){
		        console.log("read file", err);
		        var base64Image = new Buffer(original_data, 'binary').toString('base64');
		    	socket.emit('newImage', base64Image, function(data){
					lcd.clear().cursor(0,0).print("TAKING PICTURE...");
		    		console.log("EMIT CB", data);
		    	});
		    });

		});

		camera.on("exit", function( timestamp ){
			console.log("Shooting child process has exited");
			led.stop().off();			
		});

		camera.on("stop", function( err, timestamp ){
			console.log("Shooting child process has been stopped at " + timestamp);
			led.stop().off();			
		});
	});

});

