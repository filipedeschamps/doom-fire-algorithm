const ENGINE_CANVAS = 'canvas-engine'
const PIXEL_SIZE = 4

let canvas
let ctx

function setupCanvasEngine() {
  const container = document.querySelector('#fireCanvas')

  canvas = document.createElement('canvas')
  ctx = canvas.getContext('2d')

  canvas.width = fireWidth * PIXEL_SIZE
  canvas.height = fireHeight * PIXEL_SIZE

  container.appendChild(canvas)
}

function canvasEngine() {
  for (let row = 0; row < fireHeight; row++) {
    for (let column = 0; column < fireWidth; column++) {
      const pixelIndex = column + ( fireWidth * row )
      const fireIntensity = firePixelsArray[pixelIndex]
      const color = fireColorsPalette[fireIntensity]
      const colorString = `${color.r},${color.g},${color.b}`

      ctx.fillStyle = ` rgb(${colorString})`
      ctx.fillRect(column * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
    }
  }
}
