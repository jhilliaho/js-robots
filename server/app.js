var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/images/out.png');
});

io.on('connection', function (socket) {
	console.log("connection");
  socket.on('newImage', function (data) {
    console.log("newImage");

	require("fs").rename("images/out.png", ('images/' + Date.now() + '.png'), function(){
		require("fs").writeFile("images/out.png", data, 'base64', function(err) {
		  console.log("File written", err);
		  socket.emit("imageReceived");
		});
	});

  });

  socket.on('camConnected', function () {
    console.log("camConnected");
  });


  socket.on('imageComing', function () {
    console.log("imageComing");
  });

  socket.on('imageStats', function (data) {

  	if (data.shootingStarted == undefined || data.imageCaptured == undefined || data.sendingImage == undefined || data.imageSent == undefined || ) {
  		console.log("ERROR IN IMAGE TIMING DATA");
  		return;
  	}

    var timeString = JSON.stringify(data) + '\n';
	require("fs").appendFile('imageStats.txt', timeString, function (err) {
		console.log("data", data, "written in file");
	});

  });

});

console.log("Started");