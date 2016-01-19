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

var imgCount = 0;

var pictureTimes = [];
var singleTiming = {};

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

			//console.log("high");
			if (!shootlock) {
				shootlock = true;
				imgCount++;
				console.time("PictureTiming");				
				camera.start();
			} else {
				//console.log("Shootlock!");
			}

		}, 1000);

		//});

		pir.on("low", function(e){
			console.log("low", e);
		});

		camera.on("start", function( err, timestamp ){
			console.log("Shooting started");
			singleTiming.shootingStarted = console.timeEnd("PictureTiming");		
		});

		camera.on("read", function( err, timestamp, filename ){

		    if (filename.search("~") != -1) {
		        return;
		    }
		    
			console.log("Image captured with filename: " + filename);
			singleTiming.imageCaptured = console.timeEnd("PictureTiming");		
			
		    fs.readFile("./images/" + filename, function(err, original_data){
		        var base64Image = new Buffer(original_data, 'binary').toString('base64');
		        socket.emit("imageComing");
		    	socket.emit('newImage', base64Image);
		    });

		});

		socket.on("imageReceived", function(){
		    console.log("IMAGE RECEIVED, REMOVE SHOOTLOCK");
			singleTiming = console.timeEnd("PictureTiming");
			pictureTimes.push(singleTiming);
			console.log(JSON.stringify(pictureTimes, null, 4));
			shootlock = false;
		});

		camera.on("exit", function( timestamp ){

		});

		camera.on("stop", function( err, timestamp ){

		});
	});

});

