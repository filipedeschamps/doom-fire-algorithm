var glCanvas;
var gl;
var compProgram;
var gridSSBO, heatGradientSSBO, coolingMapSSBO;
var grid, heatGradient, coolingMap;
var coolFactorUniform, timeUniform, windSpeedUniform, baseFireHeatUniform;
var time = 0.0;
var baseHeatSlider, coolFactorSlider, windSpeedSlider;

// Constants
const FPS = 60;
const GRID_SIZE_X = 256;
const GRID_SIZE_Y = 256;
const SCALE = 2;

// Clamps value between range
Math.clamp = function(a, b, c) {
    return Math.min(Math.max(a, b), c);
}

// Linear interpolation formula
function lerp(a = 0.0, b = 1.0, t = 0.0) {
    return a + t*(b-a);
}

// Remap a value from [low1, high1] to [low2, high2] 
function map(value, low1, high1, low2, high2) {
    return low2 + (value - low1) * ((high2 - low2) / (high1 - low1));
}

// Gets a color from gradient at offset t [0, 1.0]
function getGradient(colors = [], offsets = [], t = 0.0) {
    let idx = 0;
    let color_t_from = 0;
    let color_t_to = 0;
    for (let i = offsets.length - 2; i >= 0; i--) {
        let offset = offsets[i];
        if (t >= offset) {
            idx = i;
            color_t_from = offset;
            color_t_to = offsets[i + 1];
            break;
        }
    }
    let color_t = map(t, color_t_from, color_t_to, 0, 1);
    let color1 = colors[idx];
    let color2 = colors[idx + 1];

    let r = lerp(color1.r, color2.r, color_t);
    let g = lerp(color1.g, color2.g, color_t);
    let b = lerp(color1.b, color2.b, color_t);
    //let a = lerp(color1.a, color2.a, color_t);

    return {r, g, b};
}

// Generate Float32Array with rgb values from input colors, offset and resolution defined by width
function generateFloat32ArrayGradient(colors = [], offsets = [], width = 64) {
    const result = new Float32Array(width * 3);
    const step = 1.0 / (width - 1);
    for (let i = 0; i < width; i++) {
        let color = getGradient(colors, offsets, i * step);
        result[i * 3 + 0] = color.r;
        result[i * 3 + 1] = color.g;
        result[i * 3 + 2] = color.b;
    }
    return result;
}

// Gets noise and remap value from [-1, 1] to [0, 1]
function getNoise(x, y) {
    return Math.pow((noise.simplex2(x, y) + 1.0) / 2.0, 2.0)
}

// Generates cooling map using simplex noise
function generateCoolingMap() {
    const result = new Float32Array(GRID_SIZE_X * GRID_SIZE_Y);

    noise.seed(Math.random());

    // Pass for every pixel and generate noise seamless
    for (let x = 0; x < GRID_SIZE_X; x++) {
        for (let y = 0; y < GRID_SIZE_Y; y++) {
            var value = (
                getNoise(x, y) * (GRID_SIZE_X - x) * (GRID_SIZE_Y - y) +
                getNoise(x - GRID_SIZE_X, y) * (x) * (GRID_SIZE_Y - y) +
                getNoise(x - GRID_SIZE_X, y - GRID_SIZE_Y) * (x) * (y) +
                getNoise(x, y - GRID_SIZE_Y) * (GRID_SIZE_X - x) * (y)
            ) / (GRID_SIZE_X * GRID_SIZE_Y);
            result[x + y * GRID_SIZE_Y] = value;
        }
    }

    return result;
}

const execute = async () => {
    // Get some elements
    baseHeatSlider = document.getElementById("base-heat");
    coolFactorSlider = document.getElementById("cool-factor");
    windSpeedSlider = document.getElementById("wind-speed");

    // Sliders change
    baseHeatSlider.addEventListener('input', function() {
        let value = this.value;
        gl.uniform1f(baseFireHeatUniform, value);
    });

    coolFactorSlider.addEventListener('input', function() {
        let value = this.value;
        gl.uniform1f(coolFactorUniform, value);
    });

    windSpeedSlider.addEventListener('input', function() {
        let value = this.value;
        gl.uniform1f(windSpeedUniform, value);
    });

    // Initialize canvas with WebGL 2.0
    glCanvas = document.getElementById("canvas");
    gl = glCanvas.getContext("webgl2-compute", {antialias: false});
    glCanvas.width = GRID_SIZE_X;
    glCanvas.height = GRID_SIZE_Y;
    glCanvas.style.width = GRID_SIZE_X * SCALE + "px";
    glCanvas.style.height = GRID_SIZE_Y * SCALE + "px";

    if (!gl) {
        document.getElementById("error").classList.remove("hidden")
        return;
    } else {
        document.getElementById("experiment").classList.remove("hidden")
    }

    // Initialize fire grid
    grid = new Float32Array(GRID_SIZE_X * GRID_SIZE_Y + 2).fill(0.0);
    grid[0] = GRID_SIZE_X;
    grid[1] = GRID_SIZE_Y;

    // Initialize heat gradient
    heatGradient = generateFloat32ArrayGradient(
        [{r: 1.0, g: 1.0, b: 1.0}, {r: 1.0, g: 1.0, b: 0.0}, {r: 1.0, g: 0.0, b: 0.0}, {r: 0.0, g: 0.0, b: 0.0}],
        [0.0, 0.25, 0.65, 1.0], 32
    );

    // Initialize cooling map
    coolingMap = generateCoolingMap();

    for (let x = 0; x < GRID_SIZE_X; x++) {
        let idx = 2 + x + (GRID_SIZE_Y - 1.0) * GRID_SIZE_X;
        grid[idx] = 1.0;
    }

    // Compute shader
    const compCodeFetch = await fetch('shaders/fire.comp');
    const compCode = await compCodeFetch.text();

    const compShader = gl.createShader(gl.COMPUTE_SHADER);
    gl.shaderSource(compShader, compCode);
    gl.compileShader(compShader);
    if (!gl.getShaderParameter(compShader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(compShader));
        return;
    }

    // Compute program
    compProgram = gl.createProgram();
    gl.attachShader(compProgram, compShader);
    gl.linkProgram(compProgram);
    if (!gl.getProgramParameter(compProgram, gl.LINK_STATUS)) {
        console.log(gl.getProgramInfoLog(compProgram));
        return;
    }
    
    // Get uniforms locations
    coolFactorUniform = gl.getUniformLocation(compProgram, "cool_factor");
    timeUniform = gl.getUniformLocation(compProgram, "time");
    windSpeedUniform = gl.getUniformLocation(compProgram, "wind_speed");
    baseFireHeatUniform = gl.getUniformLocation(compProgram, "base_fire_heat");

    // Initialize some uniforms
    gl.useProgram(compProgram);
    gl.uniform1f(coolFactorUniform, 0.05);
    gl.uniform1f(windSpeedUniform, 0);
    gl.uniform1f(baseFireHeatUniform, 1);
    coolFactorSlider.value = 0.05;
    windSpeedSlider.value = 0;
    baseHeatSlider.value = 1;

    // Create grid buffer
    gridSSBO = gl.createBuffer();
    gl.bindBuffer(gl.SHADER_STORAGE_BUFFER, gridSSBO);
    gl.bufferData(gl.SHADER_STORAGE_BUFFER, grid, gl.DYNAMIC_COPY);
    gl.bindBufferBase(gl.SHADER_STORAGE_BUFFER, 0, gridSSBO);

    // Create heat gradient buffer;
    heatGradientSSBO = gl.createBuffer();
    gl.bindBuffer(gl.SHADER_STORAGE_BUFFER, heatGradientSSBO);
    gl.bufferData(gl.SHADER_STORAGE_BUFFER, heatGradient, gl.DYNAMIC_COPY);
    gl.bindBufferBase(gl.SHADER_STORAGE_BUFFER, 1, heatGradientSSBO);

    // Create cooling map buffer;
    coolingMapSSBO = gl.createBuffer();
    gl.bindBuffer(gl.SHADER_STORAGE_BUFFER, coolingMapSSBO);
    gl.bufferData(gl.SHADER_STORAGE_BUFFER, coolingMap, gl.DYNAMIC_COPY);
    gl.bindBufferBase(gl.SHADER_STORAGE_BUFFER, 2, coolingMapSSBO);

    // Create texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, GRID_SIZE_X, GRID_SIZE_Y);
    gl.bindImageTexture(0, texture, 0, false, 0, gl.WRITE_ONLY, gl.RGBA8);

    // Create frame buffer
    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    setTimeout(frame, 1000 / FPS);
}

// Executed every frame defined by FPS
function frame() {
    // Increase time
    time += 1;

    // Used to measure performance in Compute Shader
    var t0 = performance.now();

    // Uses compute shader program
    gl.useProgram(compProgram);

    // Defines time uniform
    gl.uniform1f(timeUniform, time);

    // Dispatch
    gl.dispatchCompute(GRID_SIZE_X, GRID_SIZE_Y, 1);

    // IDK
    gl.memoryBarrier(gl.SHADER_IMAGE_ACCESS_BARRIER_BIT);
    
    // Renders result to canvas
    gl.blitFramebuffer(
        0, 0, GRID_SIZE_X, GRID_SIZE_Y,
        0, 0, GRID_SIZE_X, GRID_SIZE_Y,
        gl.COLOR_BUFFER_BIT, gl.NEAREST
    );

    // Get the delta time from computation
    var delta = performance.now() - t0;

    // Displays delta time
    document.getElementById("fps").innerHTML = "elapsed computation time: " + delta.toFixed(2) + " milliseconds"

    setTimeout(frame, 1000 / FPS);
}

// Initialize program
execute();

// Just to debug cooling map to table
/*
let test = generateCoolingMap();

let t = document.getElementById("teste-table");

let table = "";

for (let x = 0; x < GRID_SIZE_X; x++) {
    table += "<tr>\n";
    for (let y = 0; y < GRID_SIZE_Y; y++) {
        let white = Math.round(test[x + y * GRID_SIZE_X] * 255);
        let color = `rgb(${white}, ${white}, ${white})`
        table += `\t<td style="background-color: ${color}"></td>\n`;
    }
    table += "</tr>\n";
}

t.innerHTML = table;*/