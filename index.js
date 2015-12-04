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

	lcd.clear().cursor(0, 0).print("BOARD READY");

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

		var shootlock = false;

		pir.on("high", function(e){
			console.log("high", e);
			if (!shootlock) {
				lcd.clear().cursor(0,0).print("TAKING PIC.");
				shootlock = true;		
				camera.start();
			} else {
				console.log("Shootlock!");
			}
		});

		pir.on("low", function(e){
			console.log("low", e);

		});

		camera.on("start", function( err, timestamp ){
			
			setTimeout(function(){
				lcd.clear().cursor(0,0).print("TAKING PIC..");				
			}, 700);

			console.log("Shooting started at " + timestamp);
		});

		camera.on("read", function( err, timestamp, filename ){

		    if (filename.search("~") != -1) {
		        return;
		    }

			lcd.clear().cursor(0,0).print("TAKING PIC...");				
		    
			console.log("Image captured with filename: " + filename);
			
		    fs.readFile("./images/" + filename, function(err, original_data){
				setTimeout(function(){
					lcd.clear().cursor(0,0).print("TAKING PIC..");				
				}, 300);
				console.log("read file", err);
		        var base64Image = new Buffer(original_data, 'binary').toString('base64');
		    	socket.emit('newImage', base64Image);
		    });

		});

		camera.on("exit", function( timestamp ){
			setTimeout(function(){
				lcd.clear();
				shootlock = false;		
			}, 800);
			console.log("Shooting child process has exited");
		});

		camera.on("stop", function( err, timestamp ){
			setTimeout(function(){
				lcd.clear();				
				shootlock = false;		
			}, 800);
			console.log("Shooting child process has been stopped at " + timestamp);
		});
	});

});

