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
		});
	});

  });

  socket.on('camConnected', function () {
    console.log("camConnected");
  });


  socket.on('imageComing', function () {
    console.log("imageComing");
  });

});

console.log("Started");