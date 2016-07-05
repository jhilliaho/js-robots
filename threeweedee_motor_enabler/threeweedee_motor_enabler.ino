#include <Wire.h>
#include <AccelStepper.h>


void setup() {
  Wire.begin(9);                // join i2c bus with address #8
  Wire.onReceive(receiveEvent); // register event
  Serial.begin(9600);           // start serial for output
  Serial.println("ThreeWeeDee motor enabler starting");

  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);


  // Disable motor 1
  digitalWrite(2, HIGH);

  // Disable motor 2
  digitalWrite(6, HIGH);
  
  // Disable motor 3
  digitalWrite(10, HIGH);

  // Set motor 1 speed
  digitalWrite(3, HIGH);
  digitalWrite(4, HIGH);
  digitalWrite(5, LOW);

  // Set motor 2 speed
  digitalWrite(7, HIGH);
  digitalWrite(8, HIGH);
  digitalWrite(9, LOW);

  // Set motor 3 speed
  digitalWrite(11, HIGH);
  digitalWrite(12, HIGH);
  digitalWrite(13, LOW);
}

void loop() {


}

// Function executes when data is received from master
void receiveEvent(int howMany) {
  int val1 = Wire.read();
  int val2 = Wire.read();
  int val3 = Wire.read();

  Serial.println("val1: " + val1);
  Serial.println("val2: " + val2);
  Serial.println("val3: " + val3);

  if (val1 != 1 && val1 != 0) {val1 = 1;}
  if (val2 != 1 && val2 != 0) {val2 = 1;}
  if (val3 != 1 && val3 != 0) {val3 = 1;}

  digitalWrite(2, val1);
  digitalWrite(6, val2);
  digitalWrite(10, val3);
  
}










