import config from '../config'
import * as handlers from './handlers'
import { updateFireIntensityPerPixel, createFireDataStructure } from './fire'
import renders from './renders'

function attatchButtonListeners (config) {
  for(let handlerKey in handlers) {
    const targetElement = document.getElementById(handlerKey)
    targetElement.onclick = () => config = handlers[handlerKey](config)
  }
}

function calculateFirePropagation (config) {
  for (let column = 0; column < config.fireWidth; column++) {
    for (let row = 0; row < config.fireHeight; row++) {
      const pixelIndex = column + (config.fireWidth * row)
      config = updateFireIntensityPerPixel(pixelIndex, config)
    }
  }

  return renders[config.render](config)
}

function tick () {
  return calculateFirePropagation(config)
}

function start (config) {
  createFireDataStructure(config)
  handlers.createFireSource(config)
  attatchButtonListeners(config)

  setInterval(tick, config.interval)
}

start(config)
