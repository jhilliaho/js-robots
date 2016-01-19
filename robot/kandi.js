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

	// PIN OPERATIONS
	var pir = new five.Pin({
		pin: "GPIO5",
		mode: 0
	});

	console.log("Board ready");

	// SOCKET.IO
	var socket = io.connect('http://46.101.79.118:3000', {reconnect: true});

	socket.on("disconnect", function(){
	    console.log("disconnected");
	});

	socket.on('connect', function() {
	    console.log('Connected!');
	    socket.emit('camConnected');

		var shootlock = false;

		//pir.on("high", function(e){
		setInterval(function(){

			console.log("high");
			if (!shootlock) {
				shootlock = true;		
				camera.start();
			} else {
				console.log("Shootlock!");
			}

		}, 10000);


		//});

		pir.on("low", function(e){
			console.log("low", e);
		});

		camera.on("start", function( err, timestamp ){
			console.log("Shooting started at " + timestamp);
		});

		camera.on("read", function( err, timestamp, filename ){

		    if (filename.search("~") != -1) {
		        return;
		    }
		    
			console.log("Image captured with filename: " + filename);
			
		    fs.readFile("./images/" + filename, function(err, original_data){
				console.log("read file", err);
		        var base64Image = new Buffer(original_data, 'binary').toString('base64');
		        console.log("Emiting new image");
		        socket.emit("imageComing");
		    	socket.emit('newImage', base64Image);
		    });

		});

		camera.on("exit", function( timestamp ){
			setTimeout(function(){
				shootlock = false;		
			}, 800);
			console.log("Shooting child process has exited");
		});

		camera.on("stop", function( err, timestamp ){
			setTimeout(function(){
				shootlock = false;		
			}, 800);
			console.log("Shooting child process has been stopped at " + timestamp);
		});
	});

});

