var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.set('view engine', 'ejs');

var imageDate = 0;

server.listen(3000);

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
// Connection URL 
var url = 'mongodb://localhost:27018/data';

// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");
  db = database;
  // Insert some documents 
  db.collection('surveillanceData').find({}).toArray(function(err, docs) {
    console.log("Found the following records");
    console.dir(docs);
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
			var temperature = data[0];
			var humidity = data[1];
			var date = new Date();

			db.collection('surveillanceData').insert({temperature: temperature, humidity: humidity, date: date}, function(err, result) {
				console.log("Inserted", err, result);
			});
	  	});
	});

	console.log("Started");

});