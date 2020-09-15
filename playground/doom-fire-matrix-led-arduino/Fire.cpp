/*
  Fire.cpp

  Author: Samuel da Costa Araujo Nunes
  Date: Set 2020
  Version: v0.1
*/

#include "Arduino.h"
#include "Fire.h"
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

void DoomFire::initStrip()
{
    begin();
    show();
}

void DoomFire::setup()
{
    initStrip();
    createFireDataStructure();
    createFireSource();
    renderFire();
}

void DoomFire::loop()
{
    calculateFirePropagation();
    delay(50);
    renderFire();
    delay(50);
}

void DoomFire::createFireDataStructure()
{
    int numberOfPixels = fireWidth * fireHeight;
    for (int i = 0; i < numberOfPixels; i++)
    {
        firePixelsArray[i] = 0;
    }
};
void DoomFire::calculateFirePropagation()
{
    for (int column = 0; column < fireWidth; column++)
    {
        for (int row = 0; row < fireHeight; row++)
        {
            int pixelIndex = column + (fireWidth * row);
            updateFireIntensityPerPixel(pixelIndex);
        }
    }
};

void DoomFire::updateFireIntensityPerPixel(int currentPixelIndex)
{
    int belowPixelIndex = currentPixelIndex + fireWidth;

    if (belowPixelIndex >= fireWidth * fireHeight)
    {
        return;
    }

    int decay = random(0,3);
    int belowPixelIntensity = firePixelsArray[belowPixelIndex];
    int newFireIntensity = 0;
    if (belowPixelIntensity - decay >= 0)
    {
        newFireIntensity = belowPixelIntensity - decay;
    }
    firePixelsArray[currentPixelIndex - decay] = newFireIntensity;
}

void DoomFire::renderFire()
{   
    bool debug = false;
    uint64_t fireColorsPalette[10] = {
        Color(47, 7, 7),
        Color(71, 15, 7),
        Color(203, 31,  7),
        Color(143, 39, 7),
        Color(175, 63, 7),
        Color(223, 87, 7),
        Color(207, 111, 15),
        Color(207, 135, 23),
        Color(191, 175, 47),
        Color(239, 239, 150)};

    for (int row = 0; row < fireHeight; row++)
    {
        for (int column = 0; column < fireWidth; column++)
        {
            int pixelIndex = column + (fireWidth * row);
            int intensityCurrentPixel = firePixelsArray[pixelIndex];
            if (debug)
            {
                Serial.printf("Index: %d, Value: %d\n", pixelIndex, intensityCurrentPixel);
            }
            else
            {
                setPixelColor(pixelIndex, fireColorsPalette[intensityCurrentPixel]);
            }
        }
    }
    show();
};

void DoomFire::createFireSource()
{
    for (int column = 0; column < fireWidth; column++)
    {
        int overflowPixelIndex = fireWidth * fireHeight;
        int pixelIndex = (overflowPixelIndex - fireWidth) + column;

        firePixelsArray[pixelIndex] = 10;
    }
};
