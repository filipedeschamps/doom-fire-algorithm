
const firePixelsArray = []
let fireWidth = 60
let fireHeight = 40
let debug = false
var sentido = 0
const fireColorsPalette = [];

/*
const fireColorsPalette = [
{"b":7,"g":7,"r":7},
{"b":31,"g":7,"r":7},
{"b":47,"g":15,"r":7},
{"b":71,"g":15,"r":7},
{"b":87,"g":23,"r":7},
{"b":103,"g":31,"r":7},
{"b":119,"g":31,"r":7},
{"b":143,"g":39,"r":7},
{"b":159,"g":47,"r":7},
{"b":175,"g":63,"r":7},
{"b":191,"g":71,"r":7},
{"b":199,"g":71,"r":7},
{"b":223,"g":79,"r":7},
{"b":223,"g":87,"r":7},
{"b":223,"g":87,"r":7},
{"b":215,"g":95,"r":7},
{"b":215,"g":95,"r":7},
{"b":215,"g":103,"r":15},
{"b":207,"g":111,"r":15},
{"b":207,"g":119,"r":15},
{"b":207,"g":127,"r":15},
{"b":207,"g":135,"r":23},
{"b":199,"g":135,"r":23},
{"b":199,"g":143,"r":23},
{"b":199,"g":151,"r":31},
{"b":191,"g":159,"r":31},
{"b":191,"g":159,"r":31},
{"b":191,"g":167,"r":39},
{"b":191,"g":167,"r":39},
{"b":191,"g":175,"r":47},
{"b":183,"g":175,"r":47},
{"b":183,"g":183,"r":47},
{"b":183,"g":183,"r":55},
{"b":207,"g":207,"r":111},
{"b":223,"g":223,"r":159},
{"b":239,"g":239,"r":199},
{"b":255,"g":255,"r":255}]
*/


function changeRGB(r, g, b, contador = 9){

    //contador = 9;
    
    for(i = 0; i< 37; i++){

        if( (r * i) > 255){
            r = 0
        }
        if( (g * i) > 255){
            g = 0
        }
        if( (b * i) > 255){
            b = 0
        }

        fireColorsPalette[i] = {'r':r * contador,'g':g * contador,'b':b * contador};
        console.log(fireColorsPalette)
    }

    r++
    g++
    b++

}

function start(){

    changeRGB(5,19,37, 47);
    createFireDataStructure()
    createFireSource()

  setInterval(calculateFirePropagation, 50)
}

function createFireDataStructure(){
    const numberOfPixels = fireWidth * fireHeight

    for (let i = 0; i < numberOfPixels; i++) {
        firePixelsArray[i] = 0
      }
}

function calculateFirePropagation(){
    for (let column = 0; column < fireWidth; column++) {
        for (let row = 0; row < fireHeight; row++) {
            const pixelIndex = column + ( fireWidth * row )
            //console.log(column);
            updateFireIntensityPerPixel(pixelIndex)
        }
      }

      renderFire()
}

function changeWindDirection(value){
    sentido = value
}

function updateFireIntensityPerPixel(currentPixelIndex){

    const belowPixelIndex = currentPixelIndex + fireWidth
    if(belowPixelIndex >= fireWidth * fireHeight){
        return
    }

    const decay = Math.floor(Math.random() * 3)
    const belowPixelFireIntensity = firePixelsArray[belowPixelIndex]
    const newFireIntensity = 
        belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0

        switch(sentido){
            case 0: firePixelsArray[currentPixelIndex - decay] = newFireIntensity; break;
            case 1: firePixelsArray[currentPixelIndex] = newFireIntensity; break;
            case 2: firePixelsArray[currentPixelIndex + decay] = newFireIntensity; break;
        }
}

function renderFire(){
    let html = '<table cellpadding=0>'

    for(let row = 0; row < fireHeight; row++){
        html += '<tr>'

        for(let column = 0; column < fireWidth; column++){
            const pixelIndex = column + ( fireWidth * row )
            const fireIntensity = firePixelsArray[pixelIndex]
            const color = fireColorsPalette[fireIntensity]
            const colorString = `${color.r},${color.g},${color.b}`

            if(debug === true){
                html += '<td>'
                html += `<div class="pixel-index">${pixelIndex}</div>`
                html += `<div style="color: rgb(${colorString})">${fireIntensity}</div>`
                html += '</td>'
            }else{

                html += `<td class="pixel" style="background-color: rgb(${colorString})"`
                html += '</td>'
            }
        }

        html += '</tr>'
    }

    html += '</table>'

    document.querySelector('#fireCanvas').innerHTML = html
}

function createFireSource() {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column

    firePixelsArray[pixelIndex] = 36
  }
}

function destroyFireSource(){
    for(let column = 0; column <= fireWidth; column++){
        console.log(fireHeight);
        const overflowPixelIndex = fireWidth * fireHeight
        const pixelIndex = (overflowPixelIndex - fireWidth) + column

        firePixelsArray[pixelIndex] = 0
    }
}


function increaseFireSource(){
    for(let column = 0; column <= fireWidth; column++){
        const overflowPixelIndex = fireWidth * fireHeight
        const pixelIndex = (overflowPixelIndex - fireWidth) + column
        const currentFireIntensity = firePixelsArray[pixelIndex]
    
        if(currentFireIntensity < 36){
            const increase = Math.floor(Math.random() * 14)
            const newFireIntensity = 
                currentFireIntensity + increase >= 36 ? 36 : currentFireIntensity + increase

                firePixelsArray[pixelIndex] = newFireIntensity
        }
    }
}

function decreaseFireSource() {
    for (let column = 0; column <= fireWidth; column++) {
      const overflowPixelIndex = fireWidth * fireHeight
      const pixelIndex = (overflowPixelIndex - fireWidth) + column
      const currentFireIntensity = firePixelsArray[pixelIndex]
  
      if (currentFireIntensity > 0) {
        const decay = Math.floor(Math.random() * 14)
        const newFireIntensity =
          currentFireIntensity - decay >= 0 ? currentFireIntensity - decay : 0
  
          firePixelsArray[pixelIndex] = newFireIntensity
      }
    }
  }


function toggleDebugMode(){
    if (debug === false) {
        fireWidth = 25
        fireHeight = 17
        debug = true
      } else {
        fireWidth = 60
        fireHeight = 40
        debug = false
      }

    createFireDataStructure()
    createFireSource()
}

start()