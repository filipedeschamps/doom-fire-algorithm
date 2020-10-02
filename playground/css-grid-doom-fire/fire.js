const fireValuesArray = [];
const fireWidth = 60;
const fireHeight = 40;


function start(){

  createFireDataStructure();
  createFireSource();
  renderFire();

  setInterval(calculateFirePropagation, 50);

}

function createFireDataStructure(){
  const numberOfPixels = fireWidth * fireHeight;

  for (let i = 0; i < numberOfPixels; i++){
    fireValuesArray[i] = 0;
  }
}

function calculateFirePropagation(){
  const randTimes = fireHeight/25;

  for (let column = 0; column < fireWidth; column++){
    let decayArray = [];
    for (let i=0; i<randTimes; i++){
      const rand = Math.random();
      let newArr = rand.toString(3).split('').map(Number);
      newArr.splice(0,2);
      decayArray.push(...newArr);
    }

    for (let row = 0; row < fireHeight; row++){
      const pixelIndex = column + ( fireWidth * row );


      updateFireIntensityPerPixel(pixelIndex, decayArray[row]);
    }
  }

  renderFire();
}

function updateFireIntensityPerPixel(currentPixelIndex, decay) {
  const belowPixelIndex = currentPixelIndex + fireWidth;
  if (belowPixelIndex >= fireWidth * fireHeight) {
    return;
  }

  const belowPixelFireIntensity = fireValuesArray[belowPixelIndex];
  const newFireIntensity = 
    belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;

  fireValuesArray[currentPixelIndex - decay] = newFireIntensity;

}

function renderFire(){
  let html = `<div style="width: ${4*fireWidth}px; display:grid; grid-template-columns: repeat(${fireWidth}, auto)">`;

  for (let i = 0; i<fireValuesArray.length; i++){
    html += `<div class="pixel" style="background-color: var(--color-${fireValuesArray[i]})"></div>`;
  }

  html += '</div>';

  document.querySelector('#fireCanvas').innerHTML = html;
}

function createFireSource(){
  for (let column = 0; column <= fireWidth; column++){
    const overflowPixelIndex = fireWidth * fireHeight;
    const pixelIndex = (overflowPixelIndex - fireWidth) + column;

    fireValuesArray[pixelIndex] = 36;
  }
}

function decreaseFireSource(){
  for (let column = 0; column <= fireWidth; column++){
    const overflowPixelIndex = fireWidth * fireHeight;
    const pixelIndex = (overflowPixelIndex - fireWidth) + column;

    if (fireValuesArray[pixelIndex] >= 2){
      fireValuesArray[pixelIndex] -= 2;
    } else {
      fireValuesArray[pixelIndex] = 0;
    }
    
  }
}

function increaseFireSource(){
  for (let column = 0; column <= fireWidth; column++){
    const overflowPixelIndex = fireWidth * fireHeight;
    const pixelIndex = (overflowPixelIndex - fireWidth) + column;

    if (fireValuesArray[pixelIndex] <= (36-2)){
      fireValuesArray[pixelIndex] += 2;
    } else {
      fireValuesArray[pixelIndex] = 36;
    }
  }
}

function destroyFireSource(){
  for (let column = 0; column <= fireWidth; column++){
    const overflowPixelIndex = fireWidth * fireHeight;
    const pixelIndex = (overflowPixelIndex - fireWidth) + column;

    fireValuesArray[pixelIndex] = 0;
  }
}



start();