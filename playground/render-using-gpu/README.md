<p align="center">
  <a href="https://github.com/thadeucity">
    <img src="./doom-fire.gif" width="490">
  </a>
</p>

# Doom Fire Algorithm Rendered with GPU.js

A Doom Fire version able to render more than 10x the original amount of pixels without lag.

To reach this the code uses the the JS library [GPU.js](https://github.com/gpujs/gpu.js)

To improve the code speed even further, before the rendering process starts a large table with random values is created. Instead of requesting a `Math.random()` before each frame the code uses a value stored in the table, drastically reducing the processing power requirement to calculate the fire propagation. The result is indistinguishable from the "Really Random Generated Fire".

<center>

## This Version Author

| [<img src="https://avatars0.githubusercontent.com/u/6117516?s=460&u=359134f6d9803d68deffbdca7beecac73e47d8e8&v=3&s=115" width="120"><br><sub>@thadeucity</sub>](https://github.com/thadeucity) |
| :---: |



## Original Doom Fire Author

| [<img src="https://avatars0.githubusercontent.com/u/4248081?v=3&s=115" width="120"><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) |
| :---: |

</center>