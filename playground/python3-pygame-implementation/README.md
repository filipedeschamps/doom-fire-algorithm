# Python3 - PyGame - Doom Fire
This is an implementation of "doom-fire-algorithm" in Python 3.

- It was used from the PyGame library for the development of the "render" function, which is responsible for the graphical rendering of fire particles (pixels).
- Each pixel is represented by the rendering of a square - through the 'pygame.draw.rect' function - 4px edge, which can be changed by setting the size variable inside the render function.
- The algorithm was divided into three parts: fire rendering, fire data structure and fire intensity propagation.
- The fire size grid can be configured through the "fireWidth" and "fireHeight" variables found at the beginning of the script.
- In the "render" function, changing the "debug" variable from the state of True (normal fire execution) to False (execution of tests) it is possible to see a data structure and a fire propagation graphically.

## Requirements

- Python3
- Pygame

## Execution
After installing Python 3 and PyGame, to execute scprit follow the instructions:

```sh
    cd python3-pygame-implementation/doom-fire
    python doom_fire.py
```
