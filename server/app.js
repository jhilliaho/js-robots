var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.set('view engine', 'ejs');

var imageDate = 0;

server.listen(3000);

io.on('connection', function (socket) {
	console.log("connection");
	socket.on('newImage', function (data) {
		console.log("newImage");
		require("fs").rename("images/out.jpg", ('images/' + Date.now() + '.jpg'), function(){
			require("fs").writeFile("images/out.jpg", data, 'base64', function(err) {
			  console.log("File written", err);
			  socket.emit("imageReceived");
			  imageDate = new Date();
			});
		});
	});

	socket.on('newPullUp', function (data) {
		console.log("newPullUp");
	});

	socket.on('newData', function (data) {
		console.log("newData");
	});
});

console.log("Started");