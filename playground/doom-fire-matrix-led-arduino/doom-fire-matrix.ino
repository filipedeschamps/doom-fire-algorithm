/*
  doom-fire-matrix.ino

  Author: Samuel da Costa Araújo Nunes
  Date: Set 2020
  Version: v0.1
*/

#include "Fire.h"

DoomFire doomFire(D3, 32, 32); // Pino da matrix de leds WS1812B , altura, largura.

void setup() {
  Serial.begin(9600);
  doomFire.setup();
}

void loop() {
  doomFire.loop();
}
