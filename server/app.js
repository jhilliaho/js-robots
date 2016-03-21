var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.set('view engine', 'ejs');

var imageDate = 0;

server.listen(3000);

app.use('/static', express.static(__dirname + '/public'));

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
 
// Connection URL 
var url = 'mongodb://localhost:27018/data';

// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");

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

		socket.on('newData', function (data) {
			console.log("newData ", data);
			var temperature = data.temperature;
			var humidity = data.humidity;
			var pir = data.pir;
			var lightness = 1023 - data.lightness;
			var volume = data.volume;
			var dataCounter = data.dataCounter;
			var date = new Date();

			db.collection('surveillanceData').insert({temperature: temperature, humidity: humidity, pir: pir, lightness: lightness, volume: volume, dataCounter: dataCounter, date: date}, function(err, result) {
				console.log("Inserted", err, result);
			});

			socket.broadcast.emit("newData", {temperature: temperature, humidity: humidity, pir: pir, lightness: lightness, volume: volume, date: date});
	  	});

		var dataCountPerTime = 1000;
		var getNthData = 100;

		socket.on('getData', function () {
			console.log("getData ");

			db.collection('surveillanceData').count(function(err, dataCountInDb){

				var getDataTimes = Math.ceil(dataCountInDb / dataCountPerTime);

				for (var i = 0; i < getDataTimes; ++i) {
					db.collection('surveillanceData').find({}).sort( { date: -1 } ).limit(dataCountPerTime).skip(dataCountPerTime*i).toArray(function(err, result) {
						var data = [];
						var motion = false;
						var maxVolume = 0;
						for (var i = 0; i < result.length; ++i) {
							if (result[i].volume > maxVolume) {
								maxVolume = result[i].volume;
							}
							
							if (result[i].pir == 1) {
								motion = true;
							}
							
							if (i % getNthData == 0) {
								if (motion) {
									result[i].pir = 1;
								}
								result[i].volume = maxVolume;
								data.push(result[i]);	
								motion = false;
								maxVolume = 0;
							}
						}
						socket.emit("allData", data);
					});				
				}
			});
	  	});
		socket.on("input1DataFromBrowser", function(data) {
			console.log("Sending input1DataFromBrowser", data);
			socket.emit("input1DataFromBrowser", data);
		})
	});



	app.get('/', function(req, res, next) {
		res.render('index');
	});

	console.log("Started");
	
});






























