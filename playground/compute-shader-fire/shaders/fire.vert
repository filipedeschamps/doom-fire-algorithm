#version 310 es
/*
    Simple OpenGL Vertex shader program to render a square on canvas to render the grid on fragment shader latter
*/

layout (location = 0) in vec2 position;

out vec2 uv;

void main() {
    uv = (position + 1.0) / 2.0;
    gl_Position = vec4(position, 0.0, 1.0);
}