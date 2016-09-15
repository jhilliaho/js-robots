#include <Wire.h>
#include <AccelStepper.h>

// Initialize stepper drivers
AccelStepper stepper1(1,1,0);
AccelStepper stepper2(1,9,8);
AccelStepper stepper3(1,17,16);

int motorMaxSpeed = 4000;
volatile long int counter = 0;

float speedChangingMultiplier = 2;
float motor1NextSpeed, motor2NextSpeed, motor3NextSpeed;
float motor1TargetSpeed = 0;
float motor2TargetSpeed = 0;
float motor3TargetSpeed = 0;

void setup() {
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onReceive(receiveEvent); // register event

  // Set pins
  for (int i = 0; i < 24; ++i) {
    if (i != 19 && i != 18) {
      pinMode(i, OUTPUT);
    }  
  }

  // MOTOR 1 //
  
  // Disable sleep
  digitalWriteFast(2, HIGH);

  // Disable reset
  digitalWriteFast(3, HIGH);

  // Disable motor
  digitalWriteFast(7, HIGH);

  // Set speed
  digitalWriteFast(4, HIGH);
  digitalWriteFast(5, HIGH);
  digitalWriteFast(6, HIGH);
  stepper1.setMaxSpeed(motorMaxSpeed);


  // MOTOR 2 //
  
  // Disable sleep
  digitalWriteFast(10, HIGH);

  // Disable reset
  digitalWriteFast(11, HIGH);

  // Disable motor
  digitalWriteFast(15, HIGH);

  // Set speed
  digitalWriteFast(12, HIGH);
  digitalWriteFast(13, HIGH);
  digitalWriteFast(14, HIGH);
  stepper2.setMaxSpeed(motorMaxSpeed);


  // MOTOR 3 //
  
  // Disable motor
  digitalWriteFast(23, HIGH);

  // Set speed
  digitalWriteFast(20, HIGH);
  digitalWriteFast(21, LOW);
  digitalWriteFast(22, LOW);
  stepper3.setMaxSpeed(motorMaxSpeed);
}

void loop() {

  if (counter % 10 == 0) {
    if (motor1TargetSpeed < stepper1.speed()-speedChangingMultiplier) {
      motor1NextSpeed = stepper1.speed()-speedChangingMultiplier;
    } else if (motor1TargetSpeed > stepper1.speed()+speedChangingMultiplier) {
      motor1NextSpeed = stepper1.speed()+speedChangingMultiplier;
    }
  
    if (motor2TargetSpeed < stepper2.speed()-speedChangingMultiplier) {
      motor2NextSpeed = stepper2.speed()-speedChangingMultiplier;
    } else if (motor2TargetSpeed > stepper2.speed()+speedChangingMultiplier) {
      motor2NextSpeed = stepper2.speed()+speedChangingMultiplier;
    }
  
    if (motor3TargetSpeed < stepper3.speed()-speedChangingMultiplier) {
      motor3NextSpeed = stepper3.speed()-speedChangingMultiplier;
    } else if (motor3TargetSpeed > stepper3.speed()+speedChangingMultiplier) {
      motor3NextSpeed = stepper3.speed()+speedChangingMultiplier;
    }  
    
    stepper1.setSpeed(motor1NextSpeed);
    stepper2.setSpeed(motor2NextSpeed);
    stepper3.setSpeed(motor3NextSpeed);
  }
    
  stepper1.runSpeed();
  stepper2.runSpeed();
  stepper3.runSpeed();

  counter++;

  if (counter > 99999){
    motor1TargetSpeed = 0;
    motor2TargetSpeed = 0;
    motor3TargetSpeed = 0;
    
    digitalWriteFast(7, HIGH);
    digitalWriteFast(15, HIGH);
    digitalWriteFast(23, HIGH);
    
    counter = 0;
    
    digitalWrite(13, LOW);
    delay(20);
    digitalWrite(13, HIGH);
  }
}


void receiveEvent(int howMany) {
    motor1TargetSpeed = 32 * Wire.read();
    int motor1TargetDir = Wire.read();    
    motor2TargetSpeed = 32 * Wire.read();
    int motor2TargetDir = Wire.read();
    motor3TargetSpeed = 32 * Wire.read();
    int motor3TargetDir = Wire.read();

    if (motor1TargetDir == 0) {
      motor1TargetSpeed = -motor1TargetSpeed;
    }
    if (motor2TargetDir == 0) {
      motor2TargetSpeed = -motor2TargetSpeed;
    }
    if (motor3TargetDir == 0) {
      motor3TargetSpeed = -motor3TargetSpeed;
    }

    if (motor1TargetSpeed == 0 && motor2TargetSpeed == 0 && motor3TargetSpeed == 0) {
        digitalWriteFast(7, HIGH);
        digitalWriteFast(15, HIGH);
        digitalWriteFast(23, HIGH);
    } else {
        digitalWriteFast(7, LOW);
        digitalWriteFast(15, LOW);
        digitalWriteFast(23, LOW);
    }
    counter = 0;
}








