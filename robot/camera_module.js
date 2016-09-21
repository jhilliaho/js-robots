
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
	w: 320,									// Image width
	h: 240,
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

// Set a lock variable to prevent taking new pictures before the previous one has been sent
var shootlock = false;

camera.start();


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


