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
  Wire.onReceive(receiveEvent); // register receive event

  // Set pins to output
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
  disableMotor1();

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
  disableMotor2();

  // Set speed
  digitalWriteFast(12, HIGH);
  digitalWriteFast(13, HIGH);
  digitalWriteFast(14, HIGH);
  stepper2.setMaxSpeed(motorMaxSpeed);
}

void loop() {  
  stepper1.run();
  stepper2.run();
}

void checkBalance(){

  // Calculate

}

void enableMotor1(){
  digitalWriteFast(7, LOW);
}

void enableMotor2(){
  digitalWriteFast(15, LOW);
}

void disableMotor1(){
  digitalWriteFast(7, HIGH);
}

void disableMotor2(){
  digitalWriteFast(15, HIGH);
}

// Required data:
// 1. sensor balance value
// 1. Compass angle 0-180 (0-360)
// 2. Target speed 0-255, 0-127 = backward, 128-255 = forward
// 3. Target rotation speed 0-255, 0-127 = counterclockwise, 128-255 = clockwise

void receiveEvent(int howMany) {
    String data = Wire.read();

    digitalWriteFast(13, HIGH);
    delay(100);
    digitalWriteFast(13, LOW);
}








