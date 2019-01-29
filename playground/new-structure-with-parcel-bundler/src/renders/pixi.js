import * as PIXI from 'pixi.js'
import fireColorsPalette from '../scripts/colors'

const pixelSize = 4
const from10To16 = n => n.toString(16).padStart(2, '0')

let renderState = {
  pixi: undefined,
  rendered: false
}

function startPixi (config) {
  if (!renderState.rendered || !document.querySelector(".pixi-renderer")) {
    const app = new PIXI.Application(config.fireWidth * pixelSize, config.fireHeight * pixelSize)
    const graphics = new PIXI.Graphics()
    renderState.pixi = graphics
    renderState.rendered = true
    app.stage.addChild(graphics)
    document.querySelector(config.renderTargetId).innerHTML = ''
    app.view.className = 'pixi-renderer'
    document.querySelector(config.renderTargetId).appendChild(app.view)
  }
}

function runEngine (config) {
  renderState.pixi.clear()
  for (let row = 0; row < config.fireHeight; row++) {
    for (let column = 0; column < config.fireWidth; column++) {
      const pixelIndex = column + (config.fireWidth * row)
      const fireIntensity = config.firePixelsArray[pixelIndex]
      const color = fireColorsPalette[fireIntensity]
      const colorString = `${from10To16(color.r)}${from10To16(color.g)}${from10To16(color.b)}`
      renderState.pixi.beginFill(parseInt(colorString, 16))
      renderState.pixi.drawRect(column * pixelSize, row * pixelSize, pixelSize, pixelSize)
      renderState.pixi.endFill()
    }
  }
    
}

export function renderFire (config) {
  startPixi(config)
  runEngine(config)
}
