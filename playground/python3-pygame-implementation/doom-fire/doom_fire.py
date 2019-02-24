# -*- coding: utf-8 -*-
import pygame
from random import random

pygame.init()
pygame.display.set_caption("DOOM FIRE")

fireColorsPalette = [
          (  7,  7,  7), ( 31,  7,  7), ( 47, 15,  7), ( 71, 15,  7), ( 87, 23,  7), (103, 31,  7), (119, 31,  7), (143, 39,  7),
          (159, 47,  7), (175, 63,  7), (191, 71,  7), (199, 71,  7), (223, 79,  7), (223, 87,  7), (223, 87,  7), (215, 95,  7),
          (215, 95,  7), (215,103, 15), (207,111, 15), (207,119, 15), (207,127, 15), (207,135, 23), (199,135, 23), (199,143, 23),
          (199,151, 31), (191,159, 31), (191,159, 31), (191,167, 39), (191,167, 39), (191,175, 47), (183,175, 47), (183,183, 47),
          (183,183, 55), (207,207,111), (223,223,159), (239,239,199), (255,255,255)]

firePixelsArray = []
fireWidth = 40
fireHeight = 40

clock = pygame.time.Clock()
fonts = (pygame.font.SysFont("Arial", 10), pygame.font.SysFont("Arial", 16))

def start():
    createDataFireStructure()
    createFireSource()
    renderFire()
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                exit()

        clock.tick(20) #1000 ms / 50 ms
        pygame.display.update()
        calculateFirePropagation()

def createDataFireStructure():
    numberOfPixels = fireWidth * fireHeight
    for i in range(0,numberOfPixels):
        firePixelsArray.append(0)

def calculateFirePropagation():
    for column in range(0, fireWidth):
        for row in range(0, fireHeight):
            pixelIndex = column + (fireHeight * row)
            updateFireIntensityPerPixel(pixelIndex)
    renderFire()

def updateFireIntensityPerPixel(currentPixelIndex):
    belowPixelIndex = currentPixelIndex + fireWidth

    if (belowPixelIndex >= fireWidth * fireHeight):
        return None

    decay = int(random()* 3)
    belowPixelFireIntensity = firePixelsArray[belowPixelIndex]

    if belowPixelFireIntensity - decay >= 0:
        newIntensity = belowPixelFireIntensity - decay
    else:
        newIntensity = 0

    if currentPixelIndex - decay >= 0:
        firePixelsArray[currentPixelIndex - decay] = newIntensity
    else:
        firePixelsArray[0] = newIntensity

def renderFire():
    debug = False
    if debug:
        debugSize = 50
        screen = pygame.display.set_mode((fireWidth * debugSize + fireWidth + 1, fireHeight * debugSize + fireHeight + 1), 0, 32)
        screen.fill((0,0,0))
        for row in range(0, fireHeight):
            for column in range(0, fireWidth):
                pixelIndex = column + (fireWidth * row)
                fireIntensity = firePixelsArray[pixelIndex]

                positionPixelIndex = (debugSize * column + column + 1, debugSize * row + row + 1)
                pygame.draw.rect(screen, (255,255,255), pygame.Rect(positionPixelIndex,(debugSize,debugSize)))
                textPixelIndex = fonts[0].render(str(pixelIndex), True, (120,120,120))
                screen.blit(textPixelIndex, (positionPixelIndex[0] + debugSize - 3 * (textPixelIndex.get_width() / 2), positionPixelIndex[1] + textPixelIndex.get_height() / 4))
                textFireIntensity = fonts[1].render(str(fireIntensity), True, (0,0,0))
                screen.blit(textFireIntensity, (positionPixelIndex[0] + debugSize / 2 - textFireIntensity.get_width() / 2, positionPixelIndex[1] + debugSize / 2 - textFireIntensity.get_height() / 2))

    else:
        size = 4
        screen = pygame.display.set_mode((fireWidth * size, fireHeight * size), 0, 32)
        screen.fill((0,0,0))
        screen.lock()
        for row in range(0, fireHeight):
            for column in range(0, fireWidth):
                pixelIndex = column + (fireWidth * row)
                fireIntensity = firePixelsArray[pixelIndex]

                positionPixelIndex = (size * column, size * row)
                pygame.draw.rect(screen, fireColorsPalette[fireIntensity], pygame.Rect(positionPixelIndex,(size,size)))
        screen.unlock()

def createFireSource():
    for column in range(0,fireWidth):
        overflowPixelIndex = fireWidth * fireHeight
        pixelIndex = (overflowPixelIndex - fireWidth) + column

        firePixelsArray[pixelIndex] = 36
start()
