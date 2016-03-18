#include <DHT.h>

#include <Adafruit_Sensor.h>


#include <Wire.h>

#define DHTPIN 3     // what digital pin we're connected to
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

int distance = 0;
float temperature = 0;
float humidity = 0;
int pir = 0;

int lightness = 0;
int maxVolume = 0;
int minVolume = 0;
int volumeDiff = 0;
long int volumeSum = 0;
int volume = 0;
volatile long int maxVolumeDiff = 0;
int lightnessArray[8] = {0,0,0,0,0,0,0,0};
int volumeArray[4] = {0,0,0,0};
unsigned long int lightnessAverage = 0;

void setup() {
  analogReference(INTERNAL);
  pinMode(4, OUTPUT);
  pinMode(6, INPUT);
  digitalWrite(4, HIGH);
  dht.begin();
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onRequest(requestEvent); // register event
  Wire.onReceive(receiveEvent); // register event
  Serial.begin(9600);
  Serial.println("Starting");
}

int loopCounter = 0;

void loop() {

  loopCounter++;
  if (loopCounter > 100) {
    loopCounter = 0;  
  }

  volume = analogRead(6);

  if (minVolume == 0 && maxVolume == 0) {minVolume = maxVolume = volume;}

  if (volume < minVolume) {minVolume = volume;}
  if (volume > maxVolume) {maxVolume = volume;}
  volumeDiff = (maxVolume - minVolume);
  if (volumeDiff > maxVolumeDiff) {
    maxVolumeDiff = volumeDiff;
  }

  if (loopCounter == 0) {

    Serial.print(" volumeDiff: ");
    Serial.println(maxVolumeDiff);
  
    minVolume *= 1.2;
    maxVolume /= 1.2;
    
    lightness = analogRead(7);
    lightnessArray[loopCounter % 8] = lightness;

    int lightnessSum = 0;
    for (int i = 0; i < 8; ++i) {
      lightnessSum += lightnessArray[i];
    }
    
    lightnessAverage = lightnessSum;
      
    pir = digitalRead(6);
    humidity = dht.readHumidity();
    // Read temperature as Celsius (the default)
    temperature = dht.readTemperature();
    

  }
}

long microsecondsToCentimeters(long microseconds) {
  return microseconds / 29 / 2;
}

void requestEvent() {

int tempVolumeDiff = maxVolumeDiff;

byte volumeDiff1 = tempVolumeDiff;
byte volumeDiff2 = tempVolumeDiff >> 8;

byte lightness1 = lightnessAverage;
byte lightness2 = lightnessAverage >> 8;

unsigned int tempten = (int) (temperature*10);
byte temp1 = tempten;
byte temp2 = tempten >> 8;

unsigned int humten = (int) (humidity*10);
byte hum1 = humten;
byte hum2 = humten >> 8;

byte pirData = (byte) pir;

 Serial.print("TEMP:");
 Serial.print(tempten);
 Serial.print(", HUM");
 Serial.println(humten);
  
  byte arr[9] = {temp1, temp2, hum1, hum2, pirData, volumeDiff1, volumeDiff2, lightness1, lightness2};
  Wire.write(arr, 9);
  maxVolumeDiff = 0;
}

void receiveEvent(int howMany) {
  String text = "";
  while (0 < Wire.available()) {
    char c = Wire.read();
    text += String(c);
  }
  Serial.println(text);
}
