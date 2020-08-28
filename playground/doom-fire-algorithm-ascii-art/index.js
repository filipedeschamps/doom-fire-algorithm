const firePallete = ['░', '░', '░', '░', '░', '░', '░', '░', '░', '░', '░', '░', '▒', '▒', '▒', '▒', '▒', '▒', '▓', '▓', '▓', '▓', '▓', '▓', '▓', '▓', '█', '█', '█', '█', '█', '█', '█', '█', '█', '█'];
const width = 100;
const height = 42;
const decayDelta = 3;

const pixelsArray = [];

const createPixelsStructure = () => {
  const pixels = width * height;
  for (let i = 0; i < pixels; i++) {
    pixelsArray[i] = 0;
  }
};

const calculatePropagation = () => {
  for (let column = 0; column < width; column++) {
    for (let row = 0; row < height; row++) {
      const index = column + (width * row);
      updatePixelIntensity(index);
    }
  }
};

const updatePixelIntensity = (index) => {
  const belowIndex = index + width;
  if (belowIndex < width * height) {
    const decay = Math.floor(Math.random() * decayDelta);
    const belowIntensity = pixelsArray[belowIndex];
    const newIntensity = belowIntensity - decay;

    pixelsArray[index - decay] = newIntensity > 0 ? newIntensity : 0;
  }
};

const createSource = () => {
  for (let column = 0; column <= width; column++) {
    const overflowPixel = width * height;
    const index = (overflowPixel - width) + column;

    pixelsArray[index] = firePallete.length - 1;
  }
};

const render = () => {
  let result = '';
  for (let row = 0; row < height; row++) {
    for (let column = 0; column < width; column++) {
      const index = column + (width * row);
      const intensity = pixelsArray[index];
      result += firePallete[intensity];
    }
    result += '\n';
  }
  console.clear();
  console.log('\n\n\n');
  console.log(result);
};

const start = () => {
  createPixelsStructure();
  createSource();
  setInterval(() => {
    calculatePropagation();
    render();
  }, 84);
};

start();
