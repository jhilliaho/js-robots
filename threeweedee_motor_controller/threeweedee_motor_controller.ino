#include <Wire.h>
#include <AccelStepper.h>

int phase = 1;
int speedVal = 0;
int dir = 0;
int charCount = 0;

int motor1TargetSpeed = 100;
int motor2TargetSpeed = 100;
int motor3TargetSpeed = 100;

AccelStepper stepper1(1,3,2);
AccelStepper stepper2(1,5,4);
AccelStepper stepper3(1,7,6);

int counter = 0;


void setup() {
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onReceive(receiveEvent); // register event
  Serial.begin(9600);           // start serial for output
  Serial.println("Starting");

   stepper1.setMaxSpeed(5000);
   stepper2.setMaxSpeed(5000);
   stepper3.setMaxSpeed(5000);

}

void loop() {

  stepper1.runSpeed();
  stepper2.runSpeed();
  stepper3.runSpeed();
  
  counter++;
  if (counter == 20) {

    counter = 0;
    
    if (stepper1.speed() > motor1TargetSpeed) {
      stepper1.setSpeed(stepper1.speed() - 1 );
    }
    else if (stepper1.speed() < motor1TargetSpeed) {
      stepper1.setSpeed(stepper1.speed() + 1 );
    }
    
    if (stepper2.speed() > motor2TargetSpeed) {
      stepper2.setSpeed(stepper2.speed() - 1 );
    }
    else if (stepper2.speed() < motor2TargetSpeed) {
      stepper2.setSpeed(stepper2.speed() + 1 );
    }
  
    if (stepper3.speed() > motor3TargetSpeed) {
      stepper3.setSpeed(stepper3.speed() - 1 );
    }
    else if (stepper3.speed() < motor3TargetSpeed) {
      stepper3.setSpeed(stepper3.speed() + 1 );
    }
  }
}

// function that executes whenever data is received from master
// this function is registered as an event, see setup()
void receiveEvent(int howMany) {
    motor1TargetSpeed = 8 * Wire.read();
    int motor1TargetDir = Wire.read();    
    motor2TargetSpeed = 8 * Wire.read();
    int motor2TargetDir = Wire.read();
    motor3TargetSpeed = 8 * Wire.read();
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

}










