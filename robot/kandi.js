/*
This Node.js program uses johnny-five, raspicam and socket.io libraries to take a picture
and to send it to the remote server when the PIR-sensor has noticed motion.

Copyright:
Jani Hilliaho 2016
 */

console.log("Starting the system...");

// File system module
var fs = require("fs");

// Raspicam module
var RaspiCam = require("raspicam");

// Initialize camera with Raspicam
var camera = new RaspiCam({
	mode: "photo",							// Single photo
	output: "./images/image_%06d.jpg", 		// File name
	encoding: "png",						// File type
	rotation: 180,							// Image was upside down, rotate it
	t: 10,									// Timeout 1ms, 0 makes a stream of pictures
	n: true,								// No preview
	awb: false,								// No automatic white balance
	shutter: 200000,						// Shutter time in microseconds
	ISO: 800,								// ISO sensitivity
	w: 640,									// Image width
	h: 480									// Image height

});

// WebSocket library
var io = require('socket.io-client');

// Johnny-five is library for making robots or IoT devices
var five = require("johnny-five");

// Raspi-io is Raspberry Pi API for johnny-five
var Raspi = require("raspi-io");

// Initialize johnny-five board with raspi-io
var board = new five.Board({
  io: new Raspi()
});

// Image counter
var imgCount = 0;

// Image timing data array
var pictureTimes = [];
var time = null;

// Timing of single picture
var singleTiming = {};

// Event handler runs when the johnny-five board is ready
board.on("ready", function() {

	// Initialize pin for PIR-sensor
	var pir = new five.Pin({
		pin: "GPIO5",
		mode: 0
	});

	console.log("Board ready");

	// Connect to remote server
	var socket = io.connect('http://46.101.79.118:3000', {reconnect: true});

	// Event handler runs when the connection is lost
	socket.on("disconnect", function(){
	    console.log("Disconnected from server");
	});

	// Event handler runs when there is a new connection
	socket.on('connect', function() {
	    console.log('Connected to server');

	    socket.emit('camConnected');

	    // "mutex" to prevent taking new pictures before previous one has been sent
		var shootlock = false;

		// Try to take a new picture when there is motion
		//pir.on("high", function(e){

		// Try to take a new picture after every two seconds
		setInterval(function(){

			// Take a picture if the shootlock is negative
			if (!shootlock) {
				// Set the shootlock
				shootlock = true;

				// Start timing
				singleTiming.startTime = Date.now();

				// Start the camera
				camera.start();
				console.log("Start Camera!");
			} else {
				console.log("Not taking a picture because of shootlock");
			}
		}, 2000);

		//});

		// Runs when the camera starts to take a picture
		camera.on("start", function( err, timestamp ){
			console.log("Shooting started");

			// Save timing data
			singleTiming.shootingStarted = Date.now() - singleTiming.startTime;	
		});

		// Runs when the camera has saved the picture
		camera.on("read", function( err, timestamp, filename ){

			// Do nothing if file is a temporary file
		    if (filename.search("~") != -1) {
		        return;
		    }
		    
			console.log("Image captured with filename: " + filename);
			
			// Save timing data
			singleTiming.imageCaptured = Date.now() - singleTiming.startTime;	
			
			// Read a new picture file
		    fs.readFile("./images/" + filename, function(err, original_data){

		    	// Use the file as Buffer
		        var base64Image = new Buffer(original_data, 'binary').toString('base64');

		        socket.emit("imageComing");

		        // Save timing data
				singleTiming.sendingImage = Date.now() - singleTiming.startTime;	

		        // Send the image as Buffer to the remote server
		    	socket.emit('newImage', base64Image);
		    });

		});

		// Runs when remote server has received the image
		socket.on("imageReceived", function(){
		    console.log("IMAGE RECEIVED, COUNT", imgCount++);

		    // Save timing data
			singleTiming.imageSent = Date.now() - singleTiming.startTime;
			delete singleTiming.startTime;
			pictureTimes.push(singleTiming);
			
			// Send timing data to the server
			socket.emit('imageStats', singleTiming);
			singleTiming = {};

			// Remove shootlock
			shootlock = false;
			console.log("Shootlock removed");
		});

		//listen for the "stop" event triggered when the stop method was called
		camera.on("exit", function( timestamp ){

		});

		//listen for the process to exit when the timeout has been reached
		camera.on("stop", function( err, timestamp ){

		});
	
	// End of the connection
	});
// End of the board
});

