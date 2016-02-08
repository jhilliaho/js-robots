var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.render('index');
});

io.on('connection', function (socket) {
	console.log("connection");
  socket.on('newImage', function (data) {
    console.log("newImage");

	require("fs").rename("images/out.jpg", ('images/' + Date.now() + '.jpg'), function(){
		require("fs").writeFile("images/out.jpg", data, 'base64', function(err) {
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

  	if (data.shootingStarted == undefined || data.imageCaptured == undefined || data.sendingImage == undefined || data.imageSent == undefined) {
  		console.log("ERROR IN IMAGE TIMING DATA");
  		return;
  	}

    var timeString = data.startCamera + '\t' + data.imageCaptured + '\t' + data.imageSent + '\t' + data.width + 'x' + data.height + '\n';
	require("fs").appendFile('stats.txt', timeString, function (err) {
		console.log("data", data, "written in file");
	});

  });

});

console.log("Started");