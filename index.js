console.log("Starting the system...");

var fs = require("fs");

var RaspiCam = require("raspicam");
var camera = new RaspiCam({
	mode: "photo",
	output: "./images/image_%06d.jpg", // image_000001.jpg, image_000002.jpg,...
	encoding: "png",
	rotation: 180
});


var io = require('socket.io-client');
var socket = io.connect('http://46.101.48.115:8080', {reconnect: true});

socket.on("disconnect", function(){
    console.log("disconnected");
    connected = 0;
});

// Add a connect listener
socket.on('connect', function() {
    console.log('Connected!');
    socket.emit('camConnected');

	camera.start();

});



camera.on("start", function( err, timestamp ){
	console.log("Shooting started at " + timestamp);
});

camera.on("read", function( err, timestamp, filename ){
    if (filename.search("~") != -1) {
        return;
    }
    
    
	console.log("Image captured with filename: " + filename);
	
    fs.readFile("/images/" + filename, function(err, original_data){
        console.log("read file", err);
        var base64Image = new Buffer(original_data, 'binary').toString('base64');
    	socket.emit('newImage', base64Image, function(data){
    		console.log("EMIT CB", data);
    	});
    });

});

camera.on("exit", function( timestamp ){
	console.log("Shooting child process has exited");
});

camera.on("stop", function( err, timestamp ){
	console.log("Shooting child process has been stopped at " + timestamp);
});