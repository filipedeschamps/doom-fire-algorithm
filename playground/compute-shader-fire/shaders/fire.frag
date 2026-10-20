#version 310 es
precision lowp float;

/*
    OpenGL Fragment shader that renders the grid on screen
*/

layout(std430, binding = 0) buffer SSBO1 {
    float grid[];
};

layout(std430, binding = 2) buffer SSBO2 {
    float heat_gradient[];
};

out vec4 out_color;
in vec2 uv;

// Get heat color from heat gradient
vec3 getHeat(float white) {
    white = clamp(white, 0.0, 1.0);
    white = 1.0 - white;
    int size = heat_gradient.length() / 3;
    int idx = int( white * float(size) ) * 3;
    float r = heat_gradient[idx + 0];
    float g = heat_gradient[idx + 1];
    float b = heat_gradient[idx + 2];
    return vec3(r, g, b);
}

// Gets grid pixel, offsets two because the first two elements from grid is the grid size
int idx(int x, int y) {
    int size_x = int(grid[0]);

    if (x <= 1) {
        if (y == 0) x = 2;
    } 

    return 2 + x + y * size_x;
}

void main() {
    float size_x = grid[0];
    float size_y = grid[1];

    float pixel_size_x = 1.0 / size_x;
    float pixel_size_y = 1.0 / size_y;
    vec2 pixel_size = vec2(pixel_size_x, pixel_size_y);

    ivec2 pixel_pos = ivec2(vec2(uv.x, 1.0 - uv.y) * vec2(size_x, size_y));

    int i = idx(pixel_pos.x, pixel_pos.y);
    float white = grid[i];

    out_color = vec4(getHeat(white), 1.0);
}