var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});
	
board.on("ready", function() {
	var options = {
		address: 2
	};
	board.io.i2cConfig(options);

	var lastData = [0,0,0]

	var sendState = function sendState(data){
		console.log("Sending data: ", data);
	}

	var sendPullUp = function sendPullUp(count) {
		console.log("Sending pull-up!", count);
	}

	var dataCounter = 0;

	var readNano = function readNano() {
		board.io.i2cReadOnce(0x8, 3, function(data){
			dataCounter++;

			var pullUps = data[data.length-1];
			if (pullUps) {
				sendPullUp(pullUps);
			}

			if (dataCounter >= 10) {
				dataCounter = 0;
				sendState(data);
			}
		})	
	}

	setInterval(readNano, 1000	);	

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