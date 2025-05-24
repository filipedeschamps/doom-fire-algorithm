
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const pixelHeight = 20;
const pixelWidth = 20;

const firePixelArray = [];

const intensityColors = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }]
const maxIntensity = intensityColors.length - 1;

const rows = Math.floor(height / pixelHeight);
const cols = Math.floor(width / pixelWidth);

function createFireDataStructure() {
    const totalPixels = rows * cols;
    for (let i = 0; i < totalPixels; i++) {
        firePixelArray[i] = 0;
    }
}

function createFireSource() {

    const lastRowFistPixel = firePixelArray.length - cols;

    for (let i = lastRowFistPixel; i < firePixelArray.length; i++) {
        firePixelArray[i] = maxIntensity;
    }
}

function calculateFirePropagation() {

    function coolingEffect(pixelIndex, belowPixelIndex) {
        const decay = Math.floor(Math.random() * 3)
        const belowFireIntensity = firePixelArray[belowPixelIndex];
        const newFireIntensity = belowFireIntensity - decay >= 0 ? belowFireIntensity - decay : 0;

        if (newFireIntensity < 0) {
            firePixelArray[pixelIndex] = 0;
        } else {
            firePixelArray[pixelIndex + decay] = newFireIntensity;
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const pixelIndex = i + (j * cols);
            const belowPixelIndex = pixelIndex + cols;

            if (belowPixelIndex >= firePixelArray.length) {
                continue;
            }

            coolingEffect(pixelIndex, belowPixelIndex);

        }
    }

}

function renderFire() {
    const subDivisions = 5;
    const subPixelWidth = pixelWidth / subDivisions;
    const subPixelHeight = pixelHeight / subDivisions;

    function getPixelPosition(pixel) {
        return {
            x: (pixel % cols) * pixelWidth,
            y: Math.floor(pixel / cols) * pixelHeight
        };
    }

    function getNeighborIntensities(pixel) {
        const centerIntensity = firePixelArray[pixel];
        const rightPixel = (pixel % cols < cols - 1) ?
            firePixelArray[pixel + 1] : centerIntensity;
        const bottomPixel = (Math.floor(pixel / cols) < rows - 1) ?
            firePixelArray[pixel + cols] : centerIntensity;
        const bottomRightPixel = (pixel % cols < cols - 1 && Math.floor(pixel / cols) < rows - 1) ?
            firePixelArray[pixel + cols + 1] : centerIntensity;

        return { centerIntensity, rightPixel, bottomPixel, bottomRightPixel };
    }

    function calculateInterpolatedIntensity(intensities, factorX, factorY) {
        const { centerIntensity, rightPixel, bottomPixel, bottomRightPixel } = intensities;

        const topIntensity = Math.min(maxIntensity,
            Math.round(centerIntensity * (1 - factorX) + rightPixel * factorX));
        const bottomIntensity = Math.min(maxIntensity,
            Math.round(bottomPixel * (1 - factorX) + bottomRightPixel * factorX));

        return Math.min(maxIntensity,
            Math.round(topIntensity * (1 - factorY) + bottomIntensity * factorY));
    }

    function drawRectangle(x, y, width, height, color) {
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        ctx.fillRect(x, y, width, height);
    }

    function renderSubPixel(position, intensities, sx, sy) {
        const factorX = sx / (subDivisions - 1) || 0;
        const factorY = sy / (subDivisions - 1) || 0;

        const finalIntensity = calculateInterpolatedIntensity(
            intensities,
            factorX,
            factorY
        );

        const color = intensityColors[finalIntensity];

        drawRectangle(
            position.x + (sx * subPixelWidth),
            position.y + (sy * subPixelHeight),
            Math.ceil(subPixelWidth),
            Math.ceil(subPixelHeight),
            color
        );
    }

    function renderFirePixel(pixel) {
        const pixelPosition = getPixelPosition(pixel);
        const intensities = getNeighborIntensities(pixel);

        for (let sy = 0; sy < subDivisions; sy++) {
            for (let sx = 0; sx < subDivisions; sx++) {
                renderSubPixel(pixelPosition, intensities, sx, sy);
            }
        }
    }

    for (let pixel = 0; pixel < firePixelArray.length; pixel++) {
        renderFirePixel(pixel);
    }
}



function start() {
    createFireDataStructure();
    createFireSource();

    setInterval(() => {
        calculateFirePropagation();
        renderFire();
    }, 1000 / 20);
}

start();

