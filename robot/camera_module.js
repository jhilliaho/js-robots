
connection = require("./connection_module.js");


// File system module
var fs = require("fs");

// Raspicam module
var RaspiCam = require("raspicam");

var cameraOptions = {
	mode: "photo",							// Single photo
	output: "./images/image_%06d.jpg", 		// File name
	t: 0,									// Timeout 1ms, 0 makes a stream of pictures
	n: true,								// No preview
	awb: false,								// No automatic white balance
	w: 1280,									// Image width
	h: 960,
	vf: true,
	hf: true,
	br: 65,
	co: 50,							
	shutter: 100000,							// Shutter time in microseconds
	ISO: 800
	// Used image resolutions: 320x240, 640x480, 1280x960, 2592x1944 
}

// Initialize camera with Raspicam
var camera = new RaspiCam(cameraOptions);

// Image counter
var imgCount = 0;

fs.watch('./images/image_000001.jpg', function (event, filename) {
    console.log('event is: ' + event);
    if (filename) {
        console.log('filename provided: ' + filename);
    } else {
        console.log('filename not provided');
    }
});

// Set a lock variable to prevent taking new pictures before the previous one has been sent
var shootlock = false;

setInterval(function(){

	if (!shootlock) {

		// Set the shootlock
		shootlock = true;

		// Start the camera
		camera.start();
		console.log("Start camera");
	} else {
		console.log("Not taking a picture because of shootlock");
	}

}, 2000);

// Runs when the camera starts to take a picture
camera.on("start", function( err, timestamp ){
	console.log("Shooting started");
});

// Runs when the camera has saved the picture
camera.on("read", function( err, timestamp, filename ){
   	shootlock = false;

	// Do nothing if file is a temporary file
    if (filename.search("~") != -1) {
        return;
    }
    
	console.log("Image captured with filename: " + filename);
   	shootlock = false;
		
	// Read a new picture file
    fs.readFile("./images/" + filename, function(err, original_data){
   	shootlock = false;

    	// Use the file as Buffer
        var base64Image = new Buffer(original_data, 'binary').toString('base64');

    	connection.sendImage(base64Image);
    });
});

//listen for the "stop" event triggered when the stop method was called
camera.on("exit", function( timestamp ){
   	shootlock = false;

});

//listen for the process to exit when the timeout has been reached
camera.on("stop", function( err, timestamp ){
   	shootlock = false;

});


