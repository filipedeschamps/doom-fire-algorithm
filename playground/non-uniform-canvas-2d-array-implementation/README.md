## A non-uniform fire effect implementation

This was made with canvas (the debug mode is also using it), requestAnimationFrame and a two-dimensional array.

The thing is: I've separated the random number for the column index giving it a value between `windDelta` (which is 2 by default) and `-windDelta`, so the idea is that the pixel could update its left or right neighbors, causing this little chaotic effect (slightly different form the first implementation without the wind):

![doom fire gif](https://github.com/caioferrarezi/doom-fire-algorithm/blob/master/playground/non-uniform-canvas-2d-array-implementation/doom.gif?raw=true)
