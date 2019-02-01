const firePixelsArray = []
let fireWidth = 500
let fireHeight = 250
const fireColorsPalette = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }]
const canvas = document.getElementById('fireCanvas')
canvas.width = fireWidth
canvas.height = fireHeight
const context = canvas.getContext('2d')
const image = context.createImageData(fireWidth, fireHeight)
const gravity = -0.1
const starImage = new Image()
starImage.src = './star.png'
const starsArray = []

const mouse = {
  x: fireWidth / 2,
  y: fireHeight / 2
}


const bottomPixels = []
function detectBottomPixels() {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column

    bottomPixels.push(pixelIndex)
  }
}

detectBottomPixels()

function between(value, min, max) {
  return (Math.min(max, Math.max(min, value)));
}

document.getElementById('fireCanvas').onmousemove = function(event) {
  mouse.x = Math.round(event.clientX / 2)
  mouse.y = Math.round(event.clientY / 2)

  const showerMode = document.getElementById('showerModeCheckbox').checked

  if (showerMode === true) {
    starsArray.push(createStar(mouse.x, mouse.y))
  }
}

document.getElementById('fireCanvas').onmousedown = function(event) {
  mouse.x = Math.round(event.clientX / 2)
  mouse.y = Math.round(event.clientY / 2)
  starsArray.push(createStar(mouse.x, mouse.y))
}

function createStar(x = 0, y = 0) {

  let vector = {
    x: x,
    y: y,
    velocityX: 0,
    velocityY: 0,
    accelerationX: 0,
    accelerationY: 0,
    linearPosition: 0,
    destroyed: false,
    exploding: false
  }

  function update() {

    if (vector.destroyed) {
      return
    }

    if (isAtBottom()) {
      explode()
      return
    }

    vector.accelerationY = vector.accelerationY - gravity
    vector.accelerationX = between(vector.accelerationX, -0.2,0.2)
    vector.accelerationY = between(vector.accelerationY, -0.2,0.2)

    vector.velocityX = between(vector.velocityX + vector.accelerationX, -4,4)
    vector.x = vector.x + vector.velocityX

    vector.velocityY = between(vector.velocityY + vector.accelerationY, -4,10)
    vector.y = vector.y + vector.velocityY


    vector.x = Math.round( between(vector.x, 0, fireWidth - 1) )
    vector.y = Math.round( between(vector.y, 0, fireHeight - 1) )
    vector.linearPosition = getLinearArrayPosition(vector.x, vector.y)
  }

  function draw(context) {
    if (!vector.destroyed) {
      createFireParticles()
      context.drawImage(starImage,vector.x - 7,vector.y - 6, 15, 14)
    }
  }

  function getLinearArrayPosition(x, y) {
    return x + ( fireWidth * y )
  }

  function createFireParticles() {
    firePixelsArray[vector.linearPosition] = 36

    firePixelsArray[vector.linearPosition - 3] = 36
    firePixelsArray[vector.linearPosition - 2] = 36
    firePixelsArray[vector.linearPosition - 1] = 36
    firePixelsArray[vector.linearPosition + 1] = 36
    firePixelsArray[vector.linearPosition + 2] = 36
    firePixelsArray[vector.linearPosition + 4] = 36

    firePixelsArray[vector.linearPosition - 3 - fireWidth] = 34
    firePixelsArray[vector.linearPosition - 2 - fireWidth] = 35
    firePixelsArray[vector.linearPosition - 1 - fireWidth] = 36
    firePixelsArray[vector.linearPosition + 1 - fireWidth] = 36
    firePixelsArray[vector.linearPosition + 2 - fireWidth] = 35
    firePixelsArray[vector.linearPosition + 3 - fireWidth] = 34

    firePixelsArray[vector.linearPosition - 3 - fireWidth * 2] = 30
    firePixelsArray[vector.linearPosition - 2 - fireWidth * 2] = 32
    firePixelsArray[vector.linearPosition - 1 - fireWidth * 2] = 36
    firePixelsArray[vector.linearPosition + 1 - fireWidth * 2] = 36
    firePixelsArray[vector.linearPosition + 2 - fireWidth * 2] = 32
    firePixelsArray[vector.linearPosition + 3 - fireWidth * 2] = 30

    firePixelsArray[vector.linearPosition - 3 + fireWidth] = 34
    firePixelsArray[vector.linearPosition - 2 + fireWidth] = 34
    firePixelsArray[vector.linearPosition - 1 + fireWidth] = 36
    firePixelsArray[vector.linearPosition + 1 + fireWidth] = 36
    firePixelsArray[vector.linearPosition + 2 + fireWidth] = 34
    firePixelsArray[vector.linearPosition + 3 + fireWidth] = 34

    firePixelsArray[vector.linearPosition - 3 + fireWidth * 2] = 30
    firePixelsArray[vector.linearPosition - 2 + fireWidth * 2] = 32
    firePixelsArray[vector.linearPosition - 1 + fireWidth * 2] = 36
    firePixelsArray[vector.linearPosition + 1 + fireWidth * 2] = 36
    firePixelsArray[vector.linearPosition + 2 + fireWidth * 2] = 32
    firePixelsArray[vector.linearPosition + 3 + fireWidth * 2] = 30
  }

  function explode() {

    explosionEffect(vector.x, vector.y)
    vector.destroyed = true 
  }

  function patchWithFire(x, y, intensity = 0) {
    const linearPosition = getLinearArrayPosition(x, y)

    // top
    firePixelsArray[linearPosition - (fireWidth * 1) - 3] = 30
    firePixelsArray[linearPosition - (fireWidth * 1) - 2] = 33
    firePixelsArray[linearPosition - (fireWidth * 1) - 1] = 36
    firePixelsArray[linearPosition - (fireWidth * 1) + 0] = 36
    firePixelsArray[linearPosition - (fireWidth * 1) + 1] = 36
    firePixelsArray[linearPosition - (fireWidth * 1) + 2] = 33
    firePixelsArray[linearPosition - (fireWidth * 1) + 3] = 30

    // middle
    firePixelsArray[linearPosition + (fireWidth * 0) - 3] = 36 + intensity
    firePixelsArray[linearPosition + (fireWidth * 0) - 2] = 36 + intensity
    firePixelsArray[linearPosition + (fireWidth * 0) - 1] = 36 + intensity
    firePixelsArray[linearPosition + (fireWidth * 0) + 0] = 36 + intensity
    firePixelsArray[linearPosition + (fireWidth * 0) + 1] = 36 + intensity
    firePixelsArray[linearPosition + (fireWidth * 0) + 2] = 36 + intensity
    firePixelsArray[linearPosition + (fireWidth * 0) + 3] = 36 + intensity

    // bottom
    firePixelsArray[linearPosition + (fireWidth * 1) - 3] = 30
    firePixelsArray[linearPosition + (fireWidth * 1) - 2] = 33
    firePixelsArray[linearPosition + (fireWidth * 1) - 1] = 36
    firePixelsArray[linearPosition + (fireWidth * 1) + 0] = 36
    firePixelsArray[linearPosition + (fireWidth * 1) + 1] = 36
    firePixelsArray[linearPosition + (fireWidth * 1) + 2] = 33
    firePixelsArray[linearPosition + (fireWidth * 1) + 3] = 30
  }

  function explosionEffect(x, y) {
    setTimeout(() => patchWithFire((x - 23), y + 0, -28), 120)
    setTimeout(() => patchWithFire((x - 18), y + 0, -23), 100)
    setTimeout(() => patchWithFire((x - 12), y + 0, -15), 80)
    setTimeout(() => patchWithFire((x - 8 ), y + 0, -8 ), 60)
    setTimeout(() => patchWithFire((x - 4 ), y + 0, -2 ), 40)
    setTimeout(() => patchWithFire((x - 2 ), y + 0, +0 ), 20)

    setTimeout(() => patchWithFire((x + 0 ), y + 0, +0 ), 0)

    setTimeout(() => patchWithFire((x + 2 ), y + 0, +0 ), 20)
    setTimeout(() => patchWithFire((x + 4 ), y + 0, -2 ), 40)
    setTimeout(() => patchWithFire((x + 8 ), y + 0, -8 ), 60)
    setTimeout(() => patchWithFire((x + 12), y + 0, -15), 80)
    setTimeout(() => patchWithFire((x + 18), y + 0, -23), 100)
    setTimeout(() => patchWithFire((x + 23), y + 0, -28), 120)



    // top
    setTimeout(() => patchWithFire((x - 10 ), y - 3, 0 ), 160)
    setTimeout(() => patchWithFire((x - 7 ), y - 2, 0 ), 140)
    setTimeout(() => patchWithFire((x - 5 ), y - 2, +0 ), 120)
    setTimeout(() => patchWithFire((x - 2 ), y - 2, +0 ), 70)

    setTimeout(() => patchWithFire((x + 0 ), y - 5, +0 ), 50)

    setTimeout(() => patchWithFire((x + 2 ), y - 2, +0 ), 70)
    setTimeout(() => patchWithFire((x + 5 ), y - 2, +0 ), 120)
    setTimeout(() => patchWithFire((x + 7 ), y - 2, 0 ), 140)
    setTimeout(() => patchWithFire((x + 10 ), y - 3, 0 ), 160)

    // super top
    setTimeout(() => patchWithFire((x - 5 ), y - 7, +0 ), 120)
    setTimeout(() => patchWithFire((x - 3 ), y - 7, +0 ), 120)
    setTimeout(() => patchWithFire((x - 2 ), y - 8, +0 ), 70)

    setTimeout(() => patchWithFire((x + 0 ), y - 8, +0 ), 50)

    setTimeout(() => patchWithFire((x + 2 ), y - 8, +0 ), 70)
    setTimeout(() => patchWithFire((x + 3 ), y - 7, +0 ), 120)
    setTimeout(() => patchWithFire((x + 5 ), y - 7, +0 ), 120)
    
    // super hyper top
    setTimeout(() => patchWithFire((x - 7 ), y - 8, +0 ), 160)
    setTimeout(() => patchWithFire((x - 5 ), y - 9, +0 ), 120)
    setTimeout(() => patchWithFire((x - 3 ), y - 9, +0 ), 75)
    setTimeout(() => patchWithFire((x - 1 ), y - 10, +0 ), 50)

    setTimeout(() => patchWithFire((x + 0 ), y - 10, +0 ), 25)

    setTimeout(() => patchWithFire((x + 1 ), y - 10, +0 ), 50)
    setTimeout(() => patchWithFire((x + 3 ), y - 9, +0 ), 75)
    setTimeout(() => patchWithFire((x + 5 ), y - 9, +0 ), 120)
    setTimeout(() => patchWithFire((x + 7 ), y - 8, +0 ), 160)
  }

  function isAtBottom() {
    linearPositionY = getLinearArrayPosition(vector.x, vector.y)
    return bottomPixels.includes(linearPositionY)
  }

  return {
    update,
    draw
  }
}

function start() {
  createFireDataStructure()
  requestAnimationFrame(calculateFirePropagation)
  setInterval(decreaseFireSource, 100)
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

// Start with the first star
starsArray.push(createStar(100,0))

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

  starsArray.forEach((star) => {
    star.update()
    star.draw(context)
  })
  //context.drawImage(starImage,mouse.x - 7,mouse.y - 6, 15, 14)
}

function decreaseFireSource() {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column
    const currentFireIntensity = firePixelsArray[pixelIndex]

    if (currentFireIntensity > 0) {
      const decay = Math.floor(Math.random() * 2)
      const newFireIntensity =
        currentFireIntensity - decay >= 0 ? currentFireIntensity - decay : 0

      firePixelsArray[pixelIndex] = newFireIntensity
    }
  }
}


start()
