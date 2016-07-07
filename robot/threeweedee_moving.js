exports.calcMovement = calcMovement;

var motor1 = {};
var motor2 = {};
var motor3 = {};

var dir1, dir2, dir3, spd1, spd2, spd3;
dir1 = dir2 = dir3 = spd1 = spd2 = spd3 = 0;

function calcMovement(rawAngle, rawSpeed, xPos){

	angle = Math.round(rawAngle);
	var direction = 0;
	var mirror = false;
	/*
	while (angle >= 360) {
		angle -= 360;
	}

	while (angle >= 120) {
		direction++;
		angle -= 120;
	}

	if (angle >= 60) {
		angle -= 60;
		mirror = true;
	}

	angle = Math.round(angle/30)*30;

	if (angle == 0) {
		dir1 = 1;
		dir2 = 0;
		dir3 = 0;

		spd1 = 10;
		spd2 = 0;
		spd3 = 10;				
	}

	if (angle == 30) {
		dir1 = 1;
		dir2 = 0;
		dir3 = 0;

		spd1 = 10;
		spd2 = 5;
		spd3 = 5;				
	}

	while (direction > 0) {
		direction--;
		var temp = dir2;
		dir2 = dir1;
		dir1 = dir3;
		dir3 = temp;
	}
	*/

	spd1 = 5;
	spd2 = 5;
	spd3 = 0;

	dir1 = 1;
	dir2 = 0;
	dir3 = 0;

	// Calculate final speed
	spd1 *= (rawSpeed/10);
	spd2 *= (rawSpeed/10);	
	spd3 *= (rawSpeed/10);

	// Calculate rotation
	spd1 += dir1 === 0 ? -xPos : xPos;
	spd2 += dir2 === 0 ? -xPos : xPos;
	spd3 += dir3 === 0 ? -xPos : xPos;


	if (spd1 < 0) {
		dir1 = dir1 === 0 ? 1 : 0;
		spd1 = Math.abs(spd1);
	}

	if (spd2 < 0) {
		dir2 = dir2 === 0 ? 1 : 0;
		spd2 = Math.abs(spd2);
	}

	if (spd3 < 0) {
		dir3 = dir3 === 0 ? 1 : 0;
		spd3 = Math.abs(spd3);
	}

	return [spd1, spd2, spd3, dir1, dir2, dir3];

}