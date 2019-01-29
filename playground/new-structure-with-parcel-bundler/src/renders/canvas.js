import fireColorsPalette from '../scripts/colors'
const pixelSize = 4

let renderState = {
  canvas: document.createElement('canvas'),
  rendered: false
}
renderState.canvasCtx = renderState.canvas.getContext('2d')


function startCanvas (config) {
  if (!renderState.rendered || !document.querySelector("canvas")) {
    renderState.canvas.width = config.fireWidth * pixelSize
    renderState.canvas.height = config.fireHeight * pixelSize
    document.querySelector(config.renderTargetId).innerHTML = ''
    document.querySelector(config.renderTargetId).appendChild(renderState.canvas)
    renderState.rendered = true
    console.log('Rendering using canvas')
  }
}

function stopCanvas (config) {
  if (renderState.rendered) {
    document.querySelector(config.renderTargetId).removeChild(renderState.canvas)
    renderState.rendered = false
  }
}

export function renderFire (config) {
  startCanvas(config)
  for (let row = 0; row < config.fireHeight; row++) {
    for (let column = 0; column < config.fireWidth; column++) {
      const pixelIndex = column + (config.fireWidth * row)
      const fireIntensity = config.firePixelsArray[pixelIndex]
      const color = fireColorsPalette[fireIntensity]
      const colorString = `${color.r},${color.g},${color.b}`

      renderState.canvasCtx.fillStyle = ` rgb(${colorString})`
      renderState.canvasCtx.fillRect(column * pixelSize, row * pixelSize, pixelSize, pixelSize)
    }
  }
}