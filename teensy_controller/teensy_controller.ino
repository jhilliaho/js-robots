#include <Wire.h>
#include <AccelStepper.h>

AccelStepper stepper1(1,1,0);
AccelStepper stepper2(1,9,8);
AccelStepper stepper3(1,17,16);

int motorMaxSpeed = 4000;
volatile long int counter = 0;

int motor1TargetSpeed = 0;
int motor2TargetSpeed = 0;
int motor3TargetSpeed = 0;

void setup() {
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onReceive(receiveEvent); // register event

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

  // Enable
  digitalWriteFast(7, LOW);

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

  // Enable
  digitalWriteFast(15, LOW);

  // Set speed
  digitalWriteFast(12, HIGH);
  digitalWriteFast(13, HIGH);
  digitalWriteFast(14, HIGH);
  stepper2.setMaxSpeed(motorMaxSpeed);


  // MOTOR 3 //

  // Enable
  digitalWriteFast(23, LOW);

  // Set speed
  digitalWriteFast(20, HIGH);
  digitalWriteFast(21, LOW);
  digitalWriteFast(22, LOW);
  stepper3.setMaxSpeed(motorMaxSpeed);

  delay(1000);
  digitalWriteFast(7, HIGH);
  digitalWriteFast(15, HIGH);
  digitalWriteFast(23, HIGH);  

}

void loop() {
  stepper1.setSpeed(motor1TargetSpeed);
  stepper2.setSpeed(motor2TargetSpeed);
  stepper3.setSpeed(motor3TargetSpeed);

  stepper1.runSpeed();
  stepper2.runSpeed();
  stepper3.runSpeed();

  counter++;

  if (counter > 100000){
    
    digitalWrite(13, LOW);
    delay(20);
      digitalWrite(13, HIGH);
    delay(20);
      digitalWrite(13, LOW);
    delay(20);
      digitalWrite(13, HIGH);
    delay(20);
    
    motor1TargetSpeed = 0;
    motor2TargetSpeed = 0;
    motor3TargetSpeed = 0;
    counter = 0;
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








