/*
This Node.js program uses johnny-five, raspicam and socket.io libraries to take a picture
and to send it to the remote server when the PIR-sensor has noticed motion.

Copyright:
Jani Hilliaho 2016
 */

console.log("Starting the filesizetest...");

// File system module
var fs = require("fs");

// Raspicam module
var RaspiCam = require("raspicam");

// Initialize camera with Raspicam
var camera = new RaspiCam({
	mode: "photo",							// Single picture 
	output: "./images/image_%06d.jpg", 		// File name
	rotation: 180,							// Image was upside down, rotate it
	t: 10,									// Timeout 1ms, 0 makes a stream of pictures
	n: true,								// No preview
	awb: false,								// No automatic white balance
	shutter: 100000,						// Shutter time in microseconds
	ISO: 800,								// ISO sensitivity
	w: 320,									// Image width
	h: 240,									// Image height
	q: 100 									// JPG quality 100
});

setInterval(camera.start, 1000);
// Runs when the camera starts to take a picture
camera.on("start", function( err, timestamp ){
	console.log("Shooting started");
});

// Runs when the camera has saved the picture
camera.on("read", function( err, timestamp, filename ){

	// Do nothing if file is a temporary file
    if (filename.search("~") != -1) {
        return;
    }
    
	console.log("Image captured with filename: " + filename);
});

//listen for the "stop" event triggered when the stop method was called
camera.on("exit", function( timestamp ){
	console.log("Camera exit");
});

//listen for the process to exit when the timeout has been reached
camera.on("stop", function( err, timestamp ){
	console.log("Camera stop");
});

