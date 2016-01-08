var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	console.log("connection");
  socket.emit('news', { hello: 'world' });
  socket.on('newImage', function (data) {
    console.log("newImage", data);
  });

  socket.on('imageComing', function (data) {
    console.log("imageComing", data);
  });

});

console.log("Started");