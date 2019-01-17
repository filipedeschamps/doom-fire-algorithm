const firePixelsArray = []
let fireWidth = 60
let fireHeight = 40
let windDirection = 'right'
const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]
const canvas = document.getElementById('fireCanvas')
canvas.width = fireWidth
canvas.height = fireHeight
const context = canvas.getContext('2d')
const image = context.createImageData(fireWidth, fireHeight)

function start() {
  createFireDataStructure()
  createFireSource()

  setInterval(calculateFirePropagation, 50)
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
      const pixelIndex = column + ( fireWidth * row )

      updateFireIntensityPerPixel(pixelIndex)
    }
  }

  renderFire()
}

function calculateWindPixelIndex(currentPixelIndex, windPixel) {
  return (windDirection === 'right' ? currentPixelIndex - windPixel : currentPixelIndex + windPixel)
}

function updateFireIntensityPerPixel(currentPixelIndex) {
  const belowPixelIndex = currentPixelIndex + fireWidth

  // below pixel index overflows canvas
  if (belowPixelIndex >= fireWidth * fireHeight) {
    return
  }

  const windPixel = Math.floor(Math.random() * 3)
  const belowPixelFireIntensity = firePixelsArray[belowPixelIndex]
  const newFireIntensity = belowPixelFireIntensity - windPixel >= 0 ? belowPixelFireIntensity - windPixel : 0
  const windPixelIndex = calculateWindPixelIndex(currentPixelIndex, windPixel)

  firePixelsArray[windPixelIndex] = newFireIntensity
}

function renderFire() {
  for (let pixelIndex = 0; pixelIndex < firePixelsArray.length; pixelIndex++) {
    const fireIntensity = firePixelsArray[pixelIndex]
    const color = fireColorsPalette[fireIntensity]

    image.data[pixelIndex * 4] = color.r
    image.data[pixelIndex * 4 + 1] = color.g
    image.data[pixelIndex * 4 + 2] = color.b
    image.data[pixelIndex * 4 + 3] = 255
  }
  
  context.putImageData(image, 0, 0)
}

function createFireSource() {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column

    firePixelsArray[pixelIndex] = 36
  }
}

function destroyFireSource() {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column

    firePixelsArray[pixelIndex] = 0
  }
}

function increaseFireSource() {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column
    const currentFireIntensity = firePixelsArray[pixelIndex]

    if (currentFireIntensity < 36) {
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

function changeWindDirection() {
  windDirection = (windDirection === 'right' ? 'left' : 'right')
  createFireDataStructure()
  createFireSource()
}

start()
