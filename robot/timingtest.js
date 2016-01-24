console.log("Starting timing test");

setInterval(function(){

	var time = Date.now();
	console.log(Date.now()-time);

}, 200);