
console.log("Starting the system...");

// Libraries for taking pictures
var pngjs = require("pngjs");
var v4l2camera = require("v4l2camera");

var io = require('socket.io-client');
var socket = io.connect('http://46.101.48.115:8080', {reconnect: true});

var cam = new v4l2camera.Camera("/dev/video0")
cam.configSet({width: 352, height: 288});
cam.start();

socket.on("disconnect", function(){
    console.log("disconnected");
    connected = 0;
});

// Add a connect listener
socket.on('connect', function() {
    console.log('Connected!');
    
    socket.emit('camConnected');

    var shootLock = false;
    
    function loop() {
        console.log("take new pic");

        var rgb = cam.toRGB();

        var png = new pngjs.PNG({
            width: cam.width, height: cam.height,
            deflateLevel: 1, deflateStrategy: 1,
        });

        var size = cam.width * cam.height;

        for (var i = 0; i < size; i++) {
            png.data[i * 4 + 0] = rgb[i * 3 + 0];
            png.data[i * 4 + 1] = rgb[i * 3 + 1];
            png.data[i * 4 + 2] = rgb[i * 3 + 2];
            png.data[i * 4 + 3] = 255;
        }

        png.pack();

        var chunks = [];

        png.on('data', function(chunk) {
            chunks.push(chunk);
        });

        png.on('end', function() {
            var result = Buffer.concat(chunks);
            socket.emit('newImage', result.toString('base64'), function(data){
                console.log("EMIT CB", data);
            });
            console.log("sent png");
            setTimeout(function(){
                shootLock = false;
            }, 2000);
        });            
    }

    periodicActivity(); //call the periodicActivity function

    function periodicActivity() //
    {
            if (!shootLock) {
                shootLock = true;
                cam.capture(loop);
                console.log("lights on");
            }
		    setTimeout(periodicActivity, 30); //call the indicated function after 1 second (1000 milliseconds)                
            
	}
});



