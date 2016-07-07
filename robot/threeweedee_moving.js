exports.calcMovement = calcMovement;

var motor1, motor2, motor3 = {};

function calcMovement(rawAngle, rawSpeed, xPos){

	angle = Math.round(rawAngle/30)*30;
	while (angle >= 360) {angle -= 360;}




	if (angle == 0) {
		motor1.dir = 1;
		motor2.dir = 0;
		motor3.dir = 0;

		motor1.speed = 10;
		motor2.speed = 0;
		motor3.speed = 10;				
	}

	if (angle == 30) {
		motor1.dir = 1;
		motor2.dir = 0;
		motor3.dir = 0;

		motor1.speed = 10;
		motor2.speed = 5;
		motor3.speed = 5;				
	}

	if (angle == 60) {
		motor2.dir = 0;
		motor3.dir = 1;
		motor1.dir = 1;

		motor2.speed = 10;
		motor3.speed = 0;
		motor1.speed = 10;		
	}

	if (angle == 90) {
		motor2.dir = 0;
		motor3.dir = 1;
		motor1.dir = 1;

		motor2.speed = 10;
		motor3.speed = 5;
		motor1.speed = 5;				
	}

	if (angle == 120) {

		motor3.dir = 1;
		motor1.dir = 0;
		motor2.dir = 0;

		motor3.speed = 10;
		motor1.speed = 0;
		motor2.speed = 10;		
	}

	if (angle == 150) {
		motor3.dir = 1;
		motor1.dir = 0;
		motor2.dir = 0;

		motor3.speed = 10;
		motor1.speed = 5;
		motor2.speed = 5;				
	}

	if (angle == 180) {
		motor1.dir = 0;
		motor2.dir = 1;
		motor3.dir = 1;

		motor1.speed = 10;
		motor2.speed = 0;
		motor3.speed = 10;				
	}

	if (angle == 210) {
		motor1.dir = 0;
		motor2.dir = 1;
		motor3.dir = 1;

		motor1.speed = 10;
		motor2.speed = 5;
		motor3.speed = 5;				
	}

	if (angle == 240) {
		motor2.dir = 1;
		motor3.dir = 0;
		motor1.dir = 0;

		motor2.speed = 10;
		motor3.speed = 0;
		motor1.speed = 10;		
	}

	if (angle == 270) {
		motor2.dir = 1;
		motor3.dir = 0;
		motor1.dir = 0;

		motor2.speed = 10;
		motor3.speed = 5;
		motor1.speed = 5;				
	}

	if (angle == 300) {
		motor3.dir = 0;
		motor1.dir = 1;
		motor2.dir = 1;

		motor3.speed = 10;
		motor1.speed = 0;
		motor2.speed = 10;		
	}

	if (angle == 330) {
		motor3.dir = 0;
		motor1.dir = 1;
		motor2.dir = 1;

		motor3.speed = 10;
		motor1.speed = 5;
		motor2.speed = 5;				
	}

	motor1.speed *= (rawSpeed/10);
	motor2.speed *= (rawSpeed/10);	
	motor3.speed *= (rawSpeed/10);

	if (motor1.dir == 0) {
		motor1.speed -= xPos;
	} else {
		motor1.speed += xPos;			
	}

	if (motor2.dir == 0) {
		motor2.speed -= xPos;
	} else {
		motor2.speed += xPos;			
	}

	if (motor3.dir == 0) {
		motor3.speed -= xPos;
	} else {
		motor3.speed += xPos;			
	}

	if (motor1.speed < 0) {
		if (motor1.dir == 0) {motor1.dir = 1;}
		else {motor1.dir = 0;}
		motor1.speed = Math.abs(motor1.speed);
	}

	if (motor2.speed < 0) {
		if (motor2.dir == 0) {motor2.dir = 1;}
		else {motor2.dir = 0;}
		motor2.speed = Math.abs(motor2.speed);
	}

	if (motor3.speed < 0) {
		if (motor3.dir == 0) {motor3.dir = 1;}
		else {motor1.dir = 0;}
		motor3.speed = Math.abs(motor3.speed);
	}

	return [motor1, motor2, motor3];

}