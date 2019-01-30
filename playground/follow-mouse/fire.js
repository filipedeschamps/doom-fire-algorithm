const firePixelsArray = []
let fireWidth = 500
let fireHeight = 250
const fireColorsPalette = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }]
const canvas = document.getElementById('fireCanvas')
canvas.width = fireWidth
canvas.height = fireHeight
const context = canvas.getContext('2d')
const image = context.createImageData(fireWidth, fireHeight)
const star = new Image()
star.src = './star.png'

const randomWalker = createRandomWalker()
const mouse = {
  x: fireWidth / 2,
  y: fireHeight / 2
}

document.onmousemove = function(event) {
  mouse.x = Math.round(event.clientX / 2)
  mouse.y = Math.round(event.clientY / 2)
}

function createRandomWalker() {
  let vector = {
    x: Math.round(fireWidth / 2),
    y: Math.round(fireHeight / 2),
    velocityX: 0,
    velocityY: 0,
    accelerationX: 0,
    accelerationY: 0
  }

  function walk() {

    //console.log(`${mouse.x} - ${vector.x} = ${mouse.x - vector.x}`)
    vector.accelerationX = (mouse.x - vector.x)
    vector.accelerationY = (mouse.y - vector.y)
    vector.accelerationX = between(vector.accelerationX, -0.5,0.5)
    vector.accelerationY = between(vector.accelerationY, -0.5,0.5)

    vector.velocityX = between(vector.velocityX + vector.accelerationX, -4,4)
    vector.x = vector.x + vector.velocityX

    vector.velocityY = between(vector.velocityY + vector.accelerationY, -4,4)
    vector.y = vector.y + vector.velocityY


    vector.x = Math.round( between(vector.x, 0, fireWidth - 1) )
    vector.y = Math.round( between(vector.y, 0, fireHeight - 1) )
    vector.linearArrayPosition = getLinearArrayPosition()
  }

  function getLinearArrayPosition() {
    vector.linearPosition = vector.x + ( fireWidth * vector.y )
  }

  function between(value, min, max) {
    return (Math.min(max, Math.max(min, value)));
  }

  return {
    vector,
    walk
  }
}

function start() {
  createFireDataStructure()
  requestAnimationFrame(calculateFirePropagation)
}

function walkRandomWalker() {
  randomWalker.walk()

  // Sorry for this mess, but it's to make a fire with more volume

  firePixelsArray[randomWalker.vector.linearPosition] = 36

  firePixelsArray[randomWalker.vector.linearPosition - 3] = 36
  firePixelsArray[randomWalker.vector.linearPosition - 2] = 36
  firePixelsArray[randomWalker.vector.linearPosition - 1] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 1] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 2] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 4] = 36

  firePixelsArray[randomWalker.vector.linearPosition - 3 - fireWidth] = 34
  firePixelsArray[randomWalker.vector.linearPosition - 2 - fireWidth] = 35
  firePixelsArray[randomWalker.vector.linearPosition - 1 - fireWidth] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 1 - fireWidth] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 2 - fireWidth] = 35
  firePixelsArray[randomWalker.vector.linearPosition + 3 - fireWidth] = 34

  firePixelsArray[randomWalker.vector.linearPosition - 3 - fireWidth * 2] = 30
  firePixelsArray[randomWalker.vector.linearPosition - 2 - fireWidth * 2] = 32
  firePixelsArray[randomWalker.vector.linearPosition - 1 - fireWidth * 2] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 1 - fireWidth * 2] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 2 - fireWidth * 2] = 32
  firePixelsArray[randomWalker.vector.linearPosition + 3 - fireWidth * 2] = 30

  firePixelsArray[randomWalker.vector.linearPosition - 3 + fireWidth] = 34
  firePixelsArray[randomWalker.vector.linearPosition - 2 + fireWidth] = 34
  firePixelsArray[randomWalker.vector.linearPosition - 1 + fireWidth] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 1 + fireWidth] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 2 + fireWidth] = 34
  firePixelsArray[randomWalker.vector.linearPosition + 3 + fireWidth] = 34

  firePixelsArray[randomWalker.vector.linearPosition - 3 + fireWidth * 2] = 30
  firePixelsArray[randomWalker.vector.linearPosition - 2 + fireWidth * 2] = 32
  firePixelsArray[randomWalker.vector.linearPosition - 1 + fireWidth * 2] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 1 + fireWidth * 2] = 36
  firePixelsArray[randomWalker.vector.linearPosition + 2 + fireWidth * 2] = 32
  firePixelsArray[randomWalker.vector.linearPosition + 3 + fireWidth * 2] = 30
}

function createFireDataStructure() {
  const numberOfPixels = fireWidth * fireHeight

  for (let i = 0; i < numberOfPixels; i++) {
    firePixelsArray[i] = 0
  }
}

function calculateFirePropagation() {
  for (let column = 0; column < fireWidth; column++) {
    for (let row = 0; row < fireHeight; row++) {
      const pixelIndex = column + (fireWidth * row)

      updateFireIntensityPerPixel(pixelIndex)
    }
  }

  renderFire()
  walkRandomWalker()
  requestAnimationFrame(calculateFirePropagation)
}

function updateFireIntensityPerPixel(currentPixelIndex) {
  const belowPixelIndex = currentPixelIndex + fireWidth

  // below pixel index overflows canvas
  if (belowPixelIndex >= fireWidth * fireHeight) {
    return
  }

  const decay = Math.floor(Math.random() * 1.5)
  const belowPixelFireIntensity = firePixelsArray[belowPixelIndex]
  const newFireIntensity =
    belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0

  firePixelsArray[currentPixelIndex - decay] = newFireIntensity
}

function renderFire() {
  const allPixels = fireWidth * fireHeight - 1

  for (let pixelIndex = 0; pixelIndex < allPixels; pixelIndex++) {
    const fireIntensity = firePixelsArray[pixelIndex]
    const color = fireColorsPalette[fireIntensity]

    image.data[pixelIndex * 4] = color.r
    image.data[pixelIndex * 4 + 1] = color.g
    image.data[pixelIndex * 4 + 2] = color.b
    image.data[pixelIndex * 4 + 3] = 255
  }

  context.putImageData(image, 0, 0)
  context.drawImage(star,randomWalker.vector.x - 7,randomWalker.vector.y - 6, 15, 14)
}


start()
