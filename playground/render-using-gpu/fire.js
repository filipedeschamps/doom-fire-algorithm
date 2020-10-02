// Code Developed by Victor Alvarenga 
// https://github.com/thadeucity
// It is a simple code, feel free to improve it wherever you want.

const fireWidth = 450;
const fireHeight = 150;
const superSampling = 2;

const randTable = Array(fireWidth*50).fill([0]);
let randSorter = 0;

let fireIntensity = Array(fireHeight).fill(null).map(() => Array(fireWidth));

let redPixelArray = Array(fireHeight*superSampling).fill(null).map(() => Array(fireWidth*superSampling));
let greenPixelArray = Array(fireHeight*superSampling).fill(null).map(() => Array(fireWidth*superSampling));
let bluePixelArray = Array(fireHeight*superSampling).fill(null).map(() => Array(fireWidth*superSampling));

const fireColorsPalette = [
  {"r":7,   "g":7,    "b":7   },
  {"r":31,  "g":7,    "b":7   },
  {"r":47,  "g":15,   "b":7   },
  {"r":71,  "g":15,   "b":7   },
  {"r":87,  "g":23,   "b":7   },
  {"r":103, "g":31,   "b":7   },
  {"r":119, "g":31,   "b":7   },
  {"r":143, "g":39,   "b":7   },
  {"r":159, "g":47,   "b":7   },
  {"r":175, "g":63,   "b":7   },
  {"r":191, "g":71,   "b":7   },
  {"r":199, "g":71,   "b":7   },
  {"r":223, "g":79,   "b":7   },
  {"r":223, "g":87,   "b":7   },
  {"r":223, "g":87,   "b":7   },
  {"r":215, "g":95,   "b":7   },
  {"r":215, "g":95,   "b":7   },
  {"r":215, "g":103,  "b":15  },
  {"r":207, "g":111,  "b":15  },
  {"r":207, "g":119,  "b":15  },
  {"r":207, "g":127,  "b":15  },
  {"r":207, "g":135,  "b":23  },
  {"r":199, "g":135,  "b":23  },
  {"r":199, "g":143,  "b":23  },
  {"r":199, "g":151,  "b":31  },
  {"r":191, "g":159,  "b":31  },
  {"r":191, "g":159,  "b":31  },
  {"r":191, "g":167,  "b":39  },
  {"r":191, "g":167,  "b":39  },
  {"r":191, "g":175,  "b":47  },
  {"r":183, "g":175,  "b":47  },
  {"r":183, "g":183,  "b":47  },
  {"r":183, "g":183,  "b":55  },
  {"r":207, "g":207,  "b":111 },
  {"r":223, "g":223,  "b":159 },
  {"r":239, "g":239,  "b":199 },
  {"r":255, "g":255,  "b":255 }
];

// Gpu.js to reduce processing time for rendering, improving the maximum
// resolution whitout lag by more than 10x the original amount
  
const gpu = new GPU();

let render = gpu.createKernel(function(redArray, greenArray, blueArray) {
  const r = redArray[this.thread.y][this.thread.x];
  const g = greenArray[this.thread.y][this.thread.x];
  const b = blueArray[this.thread.y][this.thread.x];
  this.color(r, g, b);
})
.setOutput([fireWidth*superSampling, fireHeight*superSampling])
.setGraphical(true);

// Start the Code, now because the way the new system works I cannot render the 
// canvas before I start the FirePropagation

function start(){

  createRandTable();
  changeRangeColorPallete();
  createFireDataStructure();
  createFireSource();
  setInterval(calculateFirePropagation, 50);

}


// To improve the code even further a RandTable was created to generate a large
// set of random numbers ans store it to memory so instead of requesting a new
// Math.random() for each pixel decay the this table will feed the system and
// make the final result indistinguishable from the "Really Random Fire".
function createRandTable(){
  const randTimes = fireHeight/25;
  for (let i = 0; i < randTable.length; i++){
    let decayArray = [];
    for (let j=0; j<randTimes; j++){
      const rand = Math.random();
      let newArr = rand.toString(3).split('').map(Number);
      newArr.splice(0,2);
      decayArray.push(...newArr);
    }
    randTable[i] = decayArray;
  }
}

// Change the Original 8bit Color index to one from 0 to 1 (GPU process)
function changeRangeColorPallete(){
  for (color of fireColorsPalette){
    color.r /= 255;
    color.g /= 255;
    color.b /= 255;
  }
}

// Fill all the table with the base backgroung
function createFireDataStructure(){
  for (let y=0; y<fireHeight; y++){
    fireIntensity[y].fill(0);
  }
}

// Fill the bottom row with the brightest fire value
function createFireSource(){
  fireIntensity[0].fill(36);
}

// Convert the Intencity table to a Colored Table with SuperSampling
function convertToColor(){
  for (let x = 0; x < fireWidth*superSampling; x++){
    for (let y = 0; y < fireHeight*superSampling; y++){
      const ssX = Math.floor(x/4); 
      const ssY = Math.floor(y/4); 
      redPixelArray[y][x] = fireColorsPalette[fireIntensity[ssY][ssX]].r;
      greenPixelArray[y][x] = fireColorsPalette[fireIntensity[ssY][ssX]].g;
      bluePixelArray[y][x] = fireColorsPalette[fireIntensity[ssY][ssX]].b;
    }
  }
}

// Calculate how the fire will cooldown as it goes up
function calculateFirePropagation(){
  for (let x = 0; x < fireWidth; x++){
    if (randSorter >= randTable.length){
      randSorter = 0;
    }

    for (let y = 0; y < fireHeight; y++){
      updateFireIntensityPerPixel(y, x, randTable[randSorter][y]);
    }

    randSorter ++;
  }
  
  convertToColor();
  renderFire();
}


// Will use the decay from the random table to update the pixel fire intensity as it goes up 
function updateFireIntensityPerPixel(y, x, decay) {
  if (y == 0) return;
  let xWind = x;
  if (x + decay > fireWidth){
    xWind = x + decay - fireWidth ;
  } else {
    xWind = x + decay;
  }

  fireIntensity[y][x] = (fireIntensity[y-1][xWind]) - decay >= 0 ? fireIntensity[y-1][xWind] - decay : 0;
}

// Fire Controls
function decreaseFireSource(){
  if (fireIntensity[0][0] >= 2){
    fireIntensity[0].fill(fireIntensity[0][0]-2);
  } else {
    fireIntensity[0].fill(0);
  }
}

function increaseFireSource(){
  if (fireIntensity[0][0] <= (36-2)){
    fireIntensity[0].fill(fireIntensity[0][0]+2);
  } else {
    fireIntensity[0].fill(36);
  }
}

function destroyFireSource(){
  fireIntensity[0].fill(0);
}


// Render the Canvas using the GPU
function renderFire(){
  render(redPixelArray, greenPixelArray, bluePixelArray);

  const canvas = render.canvas;

  document.querySelector('#fireCanvas').appendChild(canvas);
}

// starts the program
start();