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
volatile int maxVolume = 0;
volatile int minVolume = 0;
volatile int volumeDiff = 0;
volatile long int volumeSum = 0;
int volume = 0;
int lightnessArray[8] = {0,0,0,0,0,0,0,0};
int volumeArray[4] = {0,0,0,0};
unsigned long int lightnessAverage = 0;

void setup() {
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

volatile int loopCounter = 0;

void loop() {


  loopCounter++;

  if (loopCounter > 5000) {
    loopCounter = 0;
    maxVolume = volume;
    minVolume = volume;  
  }

  lightness = analogRead(7);
  volume = analogRead(6);

  lightnessArray[loopCounter % 8] = lightness;

  int lightnessSum = 0;
  for (int i = 0; i < 8; ++i) {
    lightnessSum += lightnessArray[i];
  }
  
  lightnessAverage = lightnessSum / 8;

  if (minVolume == 0 && maxVolume == 0) {minVolume = maxVolume = volume;}

  if (volume < minVolume) {minVolume = volume;}
  if (volume > maxVolume) {maxVolume = volume;}
  volumeDiff = maxVolume - minVolume;

  volumeArray[loopCounter % 4] = volumeDiff;
  
  volumeSum = 0;
  for (int i = 0; i < 4; ++i) {
    volumeSum += volumeArray[i];
  }
  
  pir = digitalRead(6);


  humidity = dht.readHumidity();
  // Read temperature as Celsius (the default)
  temperature = dht.readTemperature();
  

  Serial.print(" Hum:" );
  Serial.print(humidity);
  Serial.print(" Temp: ");
  Serial.print(temperature);
  Serial.print(" Pir: ");
  Serial.print(pir);
  Serial.print(" volumeSum: ");
  Serial.print(volumeSum);
  Serial.print(" Lightness: ");
  Serial.println(lightnessAverage);
  
  delay(50);
}

long microsecondsToCentimeters(long microseconds) {
  return microseconds / 29 / 2;
}

void requestEvent() {

byte volumeDiff1 = volumeSum;
byte volumeDiff2 = volumeSum >> 8;

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
  loopCounter = 0;
  maxVolume = volume;
  minVolume = volume;
  
}

void receiveEvent(int howMany) {
  String text = "";
  while (0 < Wire.available()) {
    char c = Wire.read();
    text += String(c);
  }
  Serial.println(text);
}
