var com = require("serialport");

var serialPort = new com.SerialPort("/dev/ttyAMA0", {
    baudrate: 115200
  });

serialPort.on('open',function() {
  console.log('Port open');
});


serialPort.on('data', function(data) {
  console.log(data);
});

