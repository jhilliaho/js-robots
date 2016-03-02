var com = require("serialport");

var serialPort = new com.SerialPort("/dev/ttyAMA0", {
    baudrate: 9600
  });

serialPort.on('open',function() {
  console.log('Port open');
});


serialPort.on('data', function(data) {
  console.log(data);
});

setInterval(function(){console.log("still working");}, 500);