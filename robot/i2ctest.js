var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

function toArr(string) {
	var bytes = [];
	for (var i = 0; i < string.length; ++i) {
	    bytes.push(string.charCodeAt(i));
	}
	return bytes;
}

board.on("ready", function() {
	var options = {
		address: 2
	};
	board.io.i2cConfig(options);

	var arr = toArr("Moi, miten menee?");

	board.io.i2cWrite(8, arr);

	board.io.i2cRead(0x8, 4, function(data){
		var string = new Buffer(data).toString('ascii');

		console.log("got ", data);
	})
});


/*


#include <Wire.h>

void setup() {
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onRequest(requestEvent); // register event
  Wire.onReceive(receiveEvent); // register event
  Serial.begin(9600);
  Serial.println("Starting");
}

void loop() {
  delay(1000);
}

// function that executes whenever data is requested by master
// this function is registered as an event, see setup()
void requestEvent() {
  Wire.write("0000111122223333"); // respond with message of 16 bytes
  // as expected by master
}

void receiveEvent(int howMany) {
  String text = "";
  while (0 < Wire.available()) { // loop through all but the last
    char c = Wire.read(); // receive byte as a character
    text += String(c);
  }
  Serial.println(text);
  Serial.println(text.indexOf("miten"));
}


 */