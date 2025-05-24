## Enhanced Doom Fire Algorithm: Subpixel Division & Color Interpolation

This version of the code changes the ```renderFire()``` function from the main algorithm by introducing **subpixel division** and **color interpolation**:

- **Subpixel Division:**  
    Each fire pixel is subdivided into a grid of smaller subpixels (e.g., 5x5 per pixel), rather than being rendered as a single solid color block.

- **Color Interpolation:**  
    For each subpixel, the algorithm calculates an interpolated fire intensity based on the intensities of the current pixel and its neighbors (right, bottom, and bottom-right). This value is then mapped to a color.

These enhancements result in:

- Smoother color transitions
- A less blocky fire effect

[Click here for the Demo page](https://filipedeschamps.github.io/doom-fire-algorithm/playground/subpixel-division-and-color-interpolation)