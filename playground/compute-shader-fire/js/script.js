var glCanvas;
var gl;
var compProgram;
var gridSSBO, heatGradientSSBO, coolingMapSSBO;
var grid, heatGradient, coolingMap;
var coolFactorUniform, timeUniform, windSpeedUniform, baseFireHeatUniform, secondaryFireSource;
var time = 0.0;
var baseHeatSlider, coolFactorSlider, windSpeedSlider;
var scaleX = 1.0, scaleY = 1.0;
var secondaryFireScale = 8.0;

// Constants
const FPS = 60;
const GRID_SIZE_X = 128;
const GRID_SIZE_Y = 128;
const INITIAL_GRADIENT = [
    [[1.0, 1.0, 1.0], [1.0, 1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
    [0.0, 0.25, 0.65, 1.0]
];

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

    let r = lerp(color1[0], color2[0], color_t);
    let g = lerp(color1[1], color2[1], color_t);
    let b = lerp(color1[2], color2[2], color_t);
    //let a = lerp(color1.a, color2.a, color_t);

    return [r, g, b];
}

// Generate Float32Array with rgb values from input colors, offset and resolution defined by width
function generateFloat32ArrayGradient(colors = [], offsets = [], width = 64) {
    const result = new Float32Array(width * 3);
    const step = 1.0 / (width - 1);
    for (let i = 0; i < width; i++) {
        let color = getGradient(colors, offsets, i * step);
        result[i * 3 + 0] = color[0];
        result[i * 3 + 1] = color[1];
        result[i * 3 + 2] = color[2];
    }
    return result;
}

// Gets noise and remap value from [-1, 1] to [0, 1]
function getNoise(x, y) {
    return (noise.simplex2(x, y) + 1.0) / 2.0
}

// Gets seamless noise
function getSeamlessNoise(x, y, w, h) {
    return (
        getNoise(x, y) * (w - x) * (h - y) +
        getNoise(x - w, y) * (x) * (h - y) +
        getNoise(x - w, y - h) * (x) * (y) +
        getNoise(x, y - h) * (w - x) * (y)
    ) / (w * h)
}

// Generates cooling map using simplex noise
function generateCoolingMap() {
    const result = new Float32Array(GRID_SIZE_X * GRID_SIZE_Y);
    const scale = 0.25;

    noise.seed(Math.random());

    let size_x = GRID_SIZE_X * scale;
    let size_y = GRID_SIZE_Y * scale;

    // Pass for every pixel and generate noise seamless
    for (let x = 0; x < GRID_SIZE_X; x++) {
        for (let y = 0; y < GRID_SIZE_Y; y++) {
            let nX = x * scale;
            let nY = y * scale;
            result[x + y * GRID_SIZE_X] = getSeamlessNoise(nX, nY, size_x, size_y);
        }
    }

    return result;
}

// Sets fire gradient
function setFireGradient(gradient = [], updateBuffer = false) {
    let grad = JSON.parse(JSON.stringify(gradient));
    heatGradient = generateFloat32ArrayGradient(grad[0], grad[1], 16);
    if (updateBuffer) {
        heatGradientSSBO = gl.createBuffer();
        gl.bindBuffer(gl.SHADER_STORAGE_BUFFER, heatGradientSSBO);
        gl.bufferData(gl.SHADER_STORAGE_BUFFER, heatGradient, gl.DYNAMIC_COPY);
        gl.bindBufferBase(gl.SHADER_STORAGE_BUFFER, 1, heatGradientSSBO);
    }
}

// Starts simulation execution
async function execute() {
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
    scaleX = 512 / GRID_SIZE_X;
    scaleY = 512 / GRID_SIZE_Y;

    if (!gl) {
        document.getElementById("error").classList.remove("hidden")
        return;
    } else {
        document.getElementById("experiment").classList.remove("hidden")
    }

    initGradientSlider();

    let mouseDown = false;
    let mouseX = 0, mouseY = 0;

    function mouseHold() {
        if (mouseDown) {
            let x = mouseX / scaleX;
            let y = mouseY / scaleY;

            x = Math.clamp(x, 0, GRID_SIZE_X - 1);
            y = Math.clamp(y, 0, GRID_SIZE_X - 1);

            gl.uniform4f(secondaryFireSource, x, y, secondaryFireScale, 1);

            setTimeout(mouseHold, 1);
        } else {
            gl.uniform4f(secondaryFireSource, 0, 0, 0, 0);
        }
    }

    glCanvas.addEventListener("wheel", function(ev) {
        secondaryFireScale += ev.deltaY * -0.01;
        secondaryFireScale = Math.max(secondaryFireScale, 1.0);
    });

    glCanvas.addEventListener("mousedown", function(ev) {
        mouseDown = true;
        setTimeout(mouseHold, 1);
    });

    document.addEventListener("mouseup", function() {
        mouseDown = false;
    });

    glCanvas.addEventListener("mousemove", function(ev) {
        mouseX = ev.offsetX;
        mouseY = ev.offsetY;
    });

    // Initialize fire grid
    grid = new Float32Array(GRID_SIZE_X * GRID_SIZE_Y + 2).fill(0.0);
    grid[0] = GRID_SIZE_X;
    grid[1] = GRID_SIZE_Y;

    // Initialize heat gradient
    setFireGradient(INITIAL_GRADIENT);

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
    secondaryFireSource = gl.getUniformLocation(compProgram, "secondary_fire_source");

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

// Creates DOM element from code
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild; 
}

// Initialize gradient slider
function initGradientSlider() {
    var sliders = [];
    var currentColorSlider;

    const ROOT_SLIDER = document.getElementById("gradient-slider");
    const COLOR_PICKER_ROOT = document.getElementById("color-picker");
    const COLOR_PICKER_OFFSET = COLOR_PICKER_ROOT.querySelector("#offset");
    const COLOR_PICKER_COLOR_DISPLAY = COLOR_PICKER_ROOT.querySelector("#color");
    const COLOR_PICKER_RED = COLOR_PICKER_ROOT.querySelector("#color-r");
    const COLOR_PICKER_GREEN = COLOR_PICKER_ROOT.querySelector("#color-g");
    const COLOR_PICKER_BLUE = COLOR_PICKER_ROOT.querySelector("#color-b");

    // Gets all offsets and colors
    function getOffsetsAndColors() {
        let result = [];
        for (let slider of sliders) {
            result.push([slider.colorOffset, slider.color]);
        }
        result.sort((a, b) => a[0] - b[0]);
        return result;
    }

    // Gets all offsets and colors as separated arrays
    function getOffsetAndColorsSeparated() {
        let cols = getOffsetsAndColors();
        let offsets = [];
        let colors = [];

        for (let col of cols) {
            offsets.push(col[0]);
            colors.push(col[1]);
        }
        
        return [offsets, colors];
    }

    // Updates slider gradient preview
    function updateSliderGradient() {
        const offsetsAndColors = getOffsetsAndColors();
        let stops = [];
        for (let col of offsetsAndColors) {
            let percent = `${col[0] * 100}%`;
            let color = `rgb(${col[1][0] * 255}, ${col[1][1] * 255}, ${col[1][2] * 255})`;
            stops.push(`${color} ${percent}`);
        }
        let gradientCSS = `linear-gradient(to top, ${stops.join(", ")})`;
        ROOT_SLIDER.style.background = gradientCSS;

        focusColorSlider();
    }

    // Changes current color slider
    function changeCurrentColorSlider(slider) {
        if (currentColorSlider) {
            currentColorSlider.classList.remove("focused");
        }
        currentColorSlider = slider;
        currentColorSlider.classList.add("focused");
        focusColorSlider();
    }

    // Focus color picker to a slider
    function focusColorSlider() {
        let color_r = (currentColorSlider.color[0] * 255).toFixed(0);
        let color_g = (currentColorSlider.color[1] * 255).toFixed(0);
        let color_b = (currentColorSlider.color[2] * 255).toFixed(0);

        COLOR_PICKER_OFFSET.innerHTML = `offset: ${(currentColorSlider.colorOffset * 100).toFixed(2)}%`;
        COLOR_PICKER_COLOR_DISPLAY.style.backgroundColor = `rgb(${color_r}, ${color_g}, ${color_b})`;
    
        COLOR_PICKER_RED.querySelector("input").value = color_r;
        COLOR_PICKER_GREEN.querySelector("input").value = color_g;
        COLOR_PICKER_BLUE.querySelector("input").value = color_b;

        COLOR_PICKER_RED.querySelector("span").innerHTML = color_r;
        COLOR_PICKER_GREEN.querySelector("span").innerHTML = color_g;
        COLOR_PICKER_BLUE.querySelector("span").innerHTML = color_b;
    }

    // Creates thumb
    function createThumb(offset, color) {
        var code = `<input type="range" class="gradient-step" min="0" max="1" step="0.01" value="${offset}"/>`;
        var slider = createElementFromHTML(code);

        slider.colorOffset = offset;
        slider.color = color;

        sliders.push(slider);

        ROOT_SLIDER.appendChild(slider);

        slider.addEventListener('mousedown', function(ev) {
            if (!ev.shiftKey) {
                changeCurrentColorSlider(slider);
            } else if (sliders.length > 2) {
                let idx = sliders.indexOf(this);
                sliders.splice(idx, 1);
                if (currentColorSlider == this) {
                    changeCurrentColorSlider(sliders[0]);
                }
                this.remove();
                updateSliderGradient();
            }
            ev.stopPropagation();
        });

        slider.addEventListener('input', function(ev) {
            this.colorOffset = this.value;
            updateSliderGradient();
            ev.stopPropagation();
        });

        changeCurrentColorSlider(slider);
    }

    ROOT_SLIDER.addEventListener('mousedown', function(ev) {
        let offset = 1.0 - ev.offsetY / this.offsetHeight;
        let colors = getOffsetAndColorsSeparated();
        let color = getGradient(colors[1], colors[0], offset);
        createThumb(offset, color);
        updateSliderGradient();
    });

    COLOR_PICKER_RED.querySelector("input").addEventListener('input', function() {
        currentColorSlider.color[0] = this.value / 255;
        updateSliderGradient();
    });

    COLOR_PICKER_GREEN.querySelector("input").addEventListener('input', function() {
        currentColorSlider.color[1] = this.value / 255;
        updateSliderGradient();
    });

    COLOR_PICKER_BLUE.querySelector("input").addEventListener('input', function() {
        currentColorSlider.color[2] = this.value / 255;
        updateSliderGradient();
    });

    for (let i = 0; i < INITIAL_GRADIENT[0].length; i++) {
        createThumb(INITIAL_GRADIENT[1][i], INITIAL_GRADIENT[0][i].slice());
    }

    document.getElementById("update").addEventListener('click', function() {
        setFireGradient(getOffsetAndColorsSeparated().reverse(), true);
    });

    updateSliderGradient();
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
document.addEventListener('DOMContentLoaded', execute);

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