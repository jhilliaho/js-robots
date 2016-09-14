// Example of sending data with I2C
//
// Jani Hilliaho 2016

var functionList = {};
functionList.adder = adder;

process.on('message', (m) => {
  functionList[m["name"]](m["params"])
});

function adder(params) {
	var result = 0;
	for (let i = 0; i < params.length; ++i) {
		result += params[i];
	}
	process.send({name: "adder", result: result});
}