# Doom Fire Compute Shader
The classic Doom Fire experiment but with OpenGL Compute Shader!

## What's a Compute Shader?
Firstly, you need to know what's a shader:
A shader is a type of computer program to create post-processing effects in a 3D or 2D scene.
Basically, in any game have some kind of shader, from color manipulation to very complex effects like water
reflections, scene lightning, ray-tracing, etc.
There's three types of shader:
- Vertex shader (this type of shader processes individually every vertice to form a primitive shape (3D or 2D));
- Fragment shader (this type of shader samples every pixel of the image and outputs (shows) an processed pixel);
- Compute shader (this type of shader computes arbitrary information into GPU and outputs the data into buffers);
So the Compute Shader makes mathematic calculations in GPU and can output the data into CPU with buffers.

## Why use Compute Shader?
The main advantage to make mathematic calculations into GPU is that GPU processes more tasks and processes faster than CPU.
Originally the GPU is used only for render a application and throw the result at your monitor, but nowadays the GPU is being
used to make other tasks than render. One example is Neural Networks that inputs data into GPU, makes Matrix calculation
and outputs the result to CPU, this whole process without render anything to screen. Other example being used in this
experiment is to use the GPU to calculate fire propagation and render the result to a texture that latter is rendered
into html5 canvas in CPU.

## TODO
There's many things that I want to implement like:
- Heat Gradient change option;
- Cooling map noise options;
- Change fire dimensions in runtime;
- Change simulation FPS in runtime;
- Add the capability to output the fire animation to a sprite-sheet so can be used into game engines.
- Fix some graphical bugs:
    - Cooling map not being generated seamlesly so that appears a line into screen;
    - Wind speed to the left appears a bit faster than wind speed to the right.

## Author

| [<img align="center" src="https://github.com/ghsoares.png?size=128"><br><sub>@ghsoares</sub>](https://github.com/ghsoares) |
| :---: |