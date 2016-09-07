// Example of sending data with I2C
//
// Jani Hilliaho 2016

const cp = require('child_process');
const calculator = cp.fork('function.js');

var state = {

}

function calculate(name, params, callback) {
	state[name] = {params: params, callback: callback}
	calculator.send({name: name, params: params});
}

calculator.on('message', (m) => {
	state[m.name].callback(m.result);
	delete state[m.name];
});

calculate("adder", [1,3,5,7,9], function(result){
	console.log("On callback, ", result);
});
