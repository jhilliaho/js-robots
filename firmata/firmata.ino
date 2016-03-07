#include <DHT.h>

#include <Adafruit_Sensor.h>


#include <Wire.h>

#define DHTPIN 2     // what digital pin we're connected to
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

const int pingPin = 7;
const int leukaDistance = 50;
int distance = 0;
float temperature = 0;
float humidity = 0;

void setup() {
  dht.begin();
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onRequest(requestEvent); // register event
  Wire.onReceive(receiveEvent); // register event
  Serial.begin(9600);
  Serial.println("Starting");
}
int leukaHelpCounter = 0;
int leukaCounter = 0;
int leukaVarmuusraja = 5;
int leukaPhase = 0;
void loop() {

  long duration, cm;

  pinMode(pingPin, OUTPUT);
  digitalWrite(pingPin, LOW);
  delayMicroseconds(2);
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(5);
  digitalWrite(pingPin, LOW);

  pinMode(pingPin, INPUT);
  duration = pulseIn(pingPin, HIGH);

  cm = microsecondsToCentimeters(duration);
  if (cm > 200) {cm = 200;}
  distance = cm;

  humidity = dht.readHumidity();
  // Read temperature as Celsius (the default)
  temperature = dht.readTemperature();
  


  if (cm < leukaDistance && leukaPhase == 0) {
    leukaHelpCounter++;
  } else if (leukaPhase == 0) {
    leukaHelpCounter = 0;
  }

  if (leukaHelpCounter > leukaVarmuusraja && leukaPhase == 0) {
    leukaPhase = 1;
    leukaHelpCounter = 0;
  }

  if (leukaPhase == 1 && cm > leukaDistance) {
    leukaHelpCounter++;
  }

  if (leukaPhase == 1 && leukaHelpCounter > leukaVarmuusraja) {
    leukaPhase = 0;
    leukaHelpCounter = 0;
    leukaCounter++;
  }

  Serial.print(cm);
  Serial.print("cm, ");
  Serial.print(temperature);
  Serial.print(" C, ");
  Serial.print(humidity);
  Serial.print("% ");
  Serial.print("Phase: ");
  Serial.print(leukaPhase);
  Serial.print(", counter: ");
  Serial.print(leukaHelpCounter);
  Serial.print(", leuat: ");
  Serial.print(leukaCounter);
  Serial.println();   

  delay(50);
}

long microsecondsToCentimeters(long microseconds) {
  return microseconds / 29 / 2;
}

void requestEvent() {

int tempten = (int) (temperature*10);
byte temp1 = (byte) tempten;
byte temp2 = (byte) tempten >> 8;

int humten = (int) (humidity*10);
byte hum1 = (byte) humten;
byte hum2 = (byte) humten >> 8;

  byte temp = (byte) temperature;
  byte hum = (byte) humidity;
  byte leuat = (byte) leukaCounter;
  
  byte arr[5] = {temp1, temp2, hum1, hum2, leuat};
  Wire.write(arr, 5);
  leukaCounter = 0;
}

void receiveEvent(int howMany) {
  String text = "";
  while (0 < Wire.available()) {
    char c = Wire.read();
    text += String(c);
  }
  Serial.println(text);
}
