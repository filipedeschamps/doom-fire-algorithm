import { createFireDataStructure } from '../engines/js/fire'
import defaultConfig from '../config.json'

export function createFireSource (config) {
  for (let column = 0; column <= config.fireWidth; column++) {
    const overflowPixelIndex = config.fireWidth * config.fireHeight
    const pixelIndex = (overflowPixelIndex - config.fireWidth) + column

    config.firePixelsArray[pixelIndex] = 36
  }
  return config
}

export function destroyFireSource (config) {
  for (let column = 0; column <= config.fireWidth; column++) {
    const overflowPixelIndex = config.fireWidth * config.fireHeight
    const pixelIndex = (overflowPixelIndex - config.fireWidth) + column

    config.firePixelsArray[pixelIndex] = 0
  }
  return config
}

export function increaseFireSource (config) {
  for (let column = 0; column <= config.fireWidth; column++) {
    const overflowPixelIndex = config.fireWidth * config.fireHeight
    const pixelIndex = (overflowPixelIndex - config.fireWidth) + column
    const currentFireIntensity = config.firePixelsArray[pixelIndex]
    if (currentFireIntensity < 36) {
      const increase = Math.floor(Math.random() * 14)
      const newFireIntensity =
      currentFireIntensity + increase >= 36 ? 36 : currentFireIntensity + increase
      config.firePixelsArray[pixelIndex] = newFireIntensity
    }
  }
  return config
}

export function decreaseFireSource (config) {
  for (let column = 0; column <= config.fireWidth; column++) {
    const overflowPixelIndex = config.fireWidth * config.fireHeight
    const pixelIndex = (overflowPixelIndex - config.fireWidth) + column
    const currentFireIntensity = config.firePixelsArray[pixelIndex]

    if (currentFireIntensity > 0) {
      const decay = Math.floor(Math.random() * 14)
      const newFireIntensity =
      currentFireIntensity - decay >= 0 ? currentFireIntensity - decay : 0

      config.firePixelsArray[pixelIndex] = newFireIntensity
    }
  }
  return config
}

export function toggleJSRender (config) {
  document.getElementById('engine-info').innerHTML = 'js'
  window.start({
    ...config,
    fireHeight: defaultConfig.fireHeight,
    fireWidth: defaultConfig.fireWidth,
    engine: 'js',
  })
}

export function toggleRustRender (config) {
  document.getElementById('engine-info').innerHTML = 'rust'
  window.start({
    ...config,
    fireHeight: defaultConfig.fireHeight,
    fireWidth: defaultConfig.fireWidth,
    engine: 'rust',
  })
}

export function toggleDebugMode (config) {
  document.getElementById('render-info').innerHTML = 'table-debug'
  window.start({
    ...config,
    render: 'table-debug',
    fireHeight: 17,
    fireWidth: 25,
  })
}

export function toggleTableRender (config) {
  document.getElementById('render-info').innerHTML = 'table'
  window.start({
    ...config,
    fireHeight: defaultConfig.fireHeight,
    fireWidth: defaultConfig.fireWidth,
    render: 'table',
  })
}

export function toggleCanvasRender (config) {
  document.getElementById('render-info').innerHTML = 'canvas'
  window.start({
    ...config,
    fireHeight: defaultConfig.fireHeight,
    fireWidth: defaultConfig.fireWidth,
    render: 'canvas',
  })
}

export function togglePixi (config) {
  document.getElementById('render-info').innerHTML = 'pixi'
  window.start({
    ...config,
    fireHeight: defaultConfig.fireHeight,
    fireWidth: defaultConfig.fireWidth,
    render: 'pixi',
  })
}