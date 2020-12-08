const fireColorsPalette = [
  { "r": 7, "g": 7, "b": 7 },
  { "r": 31, "g": 7, "b": 7 },
  { "r": 47, "g": 15, "b": 7 },
  { "r": 71, "g": 15, "b": 7 },
  { "r": 87, "g": 23, "b": 7 },
  { "r": 103, "g": 31, "b": 7 },
  { "r": 119, "g": 31, "b": 7 },
  { "r": 143, "g": 39, "b": 7 },
  { "r": 159, "g": 47, "b": 7 },
  { "r": 175, "g": 63, "b": 7 },
  { "r": 191, "g": 71, "b": 7 },
  { "r": 199, "g": 71, "b": 7 },
  { "r": 223, "g": 79, "b": 7 },
  { "r": 223, "g": 87, "b": 7 },
  { "r": 223, "g": 87, "b": 7 },
  { "r": 215, "g": 95, "b": 7 },
  { "r": 215, "g": 95, "b": 7 },
  { "r": 215, "g": 103, "b": 15 },
  { "r": 207, "g": 111, "b": 15 },
  { "r": 207, "g": 119, "b": 15 },
  { "r": 207, "g": 127, "b": 15 },
  { "r": 207, "g": 135, "b": 23 },
  { "r": 199, "g": 135, "b": 23 },
  { "r": 199, "g": 143, "b": 23 },
  { "r": 199, "g": 151, "b": 31 },
  { "r": 191, "g": 159, "b": 31 },
  { "r": 191, "g": 159, "b": 31 },
  { "r": 191, "g": 167, "b": 39 },
  { "r": 191, "g": 167, "b": 39 },
  { "r": 191, "g": 175, "b": 47 },
  { "r": 183, "g": 175, "b": 47 },
  { "r": 183, "g": 183, "b": 47 },
  { "r": 183, "g": 183, "b": 55 },
  { "r": 207, "g": 207, "b": 111 },
  { "r": 223, "g": 223, "b": 159 },
  { "r": 239, "g": 239, "b": 199 },
  { "r": 255, "g": 255, "b": 255 }
]

const firePixelArray = [];
const fireWidth = 80;
const fireHeight = 50;

const maxDecay = 10;
const windDelta = 2;

let pixelSize = 5;
let decayDelta = 3;

let debug = false;

let canvas;
let context;

function start() {
  setCanvas();
  createDataStructure();
  createFireSource();

  window.requestAnimationFrame(fireFrame);
}

function setCanvas() {
  canvas = document.querySelector("#canvas");

  canvas.width = fireWidth * pixelSize;
  canvas.height = fireHeight * pixelSize;

  context = canvas.getContext('2d');
}

function fireFrame() {
  context.clearRect(0, 0, fireWidth * pixelSize, fireHeight * pixelSize);

  calculateFirePropagation();
  renderFire();

  window.requestAnimationFrame(fireFrame);
}

function createDataStructure() {
  for (let row = 0; row < fireHeight; row++) {
    firePixelArray[row] = [];

    for (let column = 0; column < fireWidth; column++) {
      firePixelArray[row][column] = 0;
    }
  }
}

function calculateFirePropagation() {
  for (let row = 0; row < fireHeight; row++) {
    for (let column = 0; column < fireWidth; column++) {
      updateFireIntensityPerPixel(row, column);
    }
  }
}

function updateFireIntensityPerPixel(row, column) {
  const nextRow = row + 1;

  let pixelIntensity = 0;

  if (nextRow >= fireHeight) return;

  // decay and wind must be different random numbers
  if (decayDelta < maxDecay) {
    const decay = Math.floor(Math.random() * decayDelta);
    pixelIntensity = firePixelArray[nextRow][column] - decay;
  }

  // creates an non-uniform fire direction
  const wind = Math.floor(Math.random() * (windDelta - (-windDelta)) + (-windDelta));
  firePixelArray[row][column - wind] = pixelIntensity > 0 ? pixelIntensity : 0;
}

function createFireSource() {
  for (column = 0; column < fireWidth; column++) {
    firePixelArray[fireHeight - 1][column] = Math.floor(Math.random() * (36 - 34) + 34);
  }
}

function renderFire() {
  for (let row = 0; row < fireHeight - 1; row++) {
    for (let column = 0; column < fireWidth; column++) {
      const intensity = firePixelArray[row][column];
      const color = fireColorsPalette[intensity];

      const x = column * pixelSize;
      const y = row * pixelSize;

      if (debug) {
        context.strokeStyle = 'black';
        context.strokeRect(column * pixelSize, row * pixelSize, pixelSize, pixelSize);

        context.font = `${pixelSize / 2}px monospace`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        context.fillText(intensity, x + pixelSize / 2, y + pixelSize / 2);
      } else {
        context.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        context.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  }
}

start();
