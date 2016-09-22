#include <Wire.h>
#include <AccelStepper.h>

// Initialize stepper drivers
AccelStepper stepper1(1,1,0);
AccelStepper stepper2(1,9,8);

int motorMaxSpeed = 16500;
volatile long int counter = 0;

float speedChangingMultiplier = 2;
float motor1NextSpeed, motor2NextSpeed, motor3NextSpeed;
float motor1TargetSpeed = 0;
float motor2TargetSpeed = 0;

void setup() {
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onReceive(receiveEvent); // register event

  // Set pins
  for (int i = 0; i < 24; ++i) {
    if (i != 19 && i != 18) {
      pinMode(i, OUTPUT);
    }  
  }

  // MOTOR 1 (Right)//
  
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


  // MOTOR 2 (Left)//
  
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

  motor1TargetSpeed = 16000;
  motor2TargetSpeed = 16000;

  stepper1.setAcceleration(50000);
  stepper2.setAcceleration(50000);
  stepper1.moveTo(6400);
  stepper2.moveTo(6400);
}



void loop() {
  
  stepper1.run();
  stepper2.run();

  counter++;
}

void checkBalance(){

  // Calculate

}

void enableMotors(){
  digitalWriteFast(7, LOW);
  digitalWriteFast(15, LOW);
}

void disableMotors(){
  digitalWriteFast(7, LOW);
  digitalWriteFast(15, LOW);
}

// Required data:
// 1. sensor balance value
// 1. Compass angle 0-180 (0-360)
// 2. Target speed 0-255, 0-127 = backward, 128-255 = forward
// 3. Target rotation speed 0-255, 0-127 = counterclockwise, 128-255 = clockwise

void receiveEvent(int howMany) {
    // Max speed = 64 * 255 = 16320
    fallingAngle = Wire.read();
    compassAngle = Wire.read() * 2;
    targetSpeed = Wire.read();
    targetRotation = Wire.read();
    counter = 0;
}








