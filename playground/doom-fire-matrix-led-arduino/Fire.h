/*
  Fire.h

  Author: Samuel da Costa Araujo Nunes
  Date: Set 2020
  Version: v0.1
 */

#ifndef Fire
#define Fire

#include "Arduino.h"
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
 #include <avr/power.h>
#endif

class DoomFire: public Adafruit_NeoPixel{
    
    public:
      DoomFire(int pin, int height, int width) : Adafruit_NeoPixel(height*width, pin, NEO_GRB + NEO_KHZ800){
        fireHeight = height;
        fireWidth = width;
        int x[height*width];
        firePixelsArray = x;

      };
      void setup();
      void loop();
      void initStrip();
      void createFireDataStructure();
      void createFireColorsPalette();
      void calculateFirePropagation();
      void createFireSource();
      void renderFire();
      void updateFireIntensityPerPixel(int currentPixelIndex);
      uint64_t fireColorsPalette[10];
      int* firePixelsArray;
    
    private:
      int fireHeight, fireWidth;
};

#endif
