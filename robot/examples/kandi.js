/*
This Node.js program uses johnny-five, raspicam and socket.io libraries to take a picture
and to send it to the remote server when the PIR-sensor has noticed motion.

Jani Hilliaho 2016
*/

console.log("Starting the system...");

// File system module
var fs = require("fs");

// Raspicam module
var RaspiCam = require("raspicam");

var cameraOptions = {
	mode: "photo",							// Single photo
	output: "./images/image_%06d.jpg", 		// File name
	t: 1,									// Timeout 1ms, 0 makes a stream of pictures
	n: true,								// No preview
	awb: false,								// No automatic white balance
	shutter: 50000,							// Shutter time in microseconds
	ISO: 800,								// ISO sensitivity
	w: 320,									// Image width
	h: 240									// Image height

	// Used image resolutions: 320x240, 640x480, 1280x960, 2592x1944 
}

// Initialize camera with Raspicam
var camera = new RaspiCam(cameraOptions);

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
var time = null;

// Timing of single picture
var singleTiming = {};

// Event handler runs when the johnny-five board is ready
board.on("ready", function() {

	// Initialize a pin for PIR sensor
	var pir = new five.Pin({
		pin: "GPIO18",
		mode: 0 			// INPUT = 0, OUTPUT = 1
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

	    // Set a lock variable to prevent taking new pictures before the previous one has been sent
		var shootlock = false;

		setInterval(function(){

			if (!shootlock) {

				// Set the shootlock
				shootlock = true;

				// Start timing
				singleTiming.startTime= Date.now();	

				// Start the camera
				camera.start();
				console.log("Start camera");
			} else {
				console.log("Not taking a picture because of shootlock");
			}

		}, 1000);

		// Runs when the camera starts to take a picture
		camera.on("start", function( err, timestamp ){
			console.log("Shooting started");

			// Save timing original_data
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
			singleTiming.width = cameraOptions.w;
			singleTiming.height = cameraOptions.h;

			// Send timing data to the server
			socket.emit('imageStats', singleTiming);
			console.log(singleTiming);
			singleTiming = {};

			// Remove shootlock
			if (imgCount < 250) {
				setTimeout(function(){
					shootlock = false;
					console.log("Shootlock removed\n\n\n\n\n");
				}, 2000);
			} else {
				process.exit()
			}
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

