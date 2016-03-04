var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.set('view engine', 'ejs');

var imageDate = 0;

server.listen(3000);

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
// Connection URL 
var url = 'mongodb://localhost:27018/surveillance';
// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");

  // Insert some documents 
  db.collection('surveillanceData').insertMany([{a : 1}, {a : 2}, {a : 3}], function(err, result) {
  	console.log("Inserted");
  });

  db.collection('surveillanceData').find({}).toArray(function(err, docs) {
    console.log("Found the following records");
    console.dir(docs);
  });

  db.close();
});

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
		console.log("newPullUp ", data);
	});

	socket.on('newData', function (data) {
		console.log("newData ", data);
	});
});

console.log("Started");