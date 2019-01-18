import { createFireDataStructure } from './fire'

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

export function toggleDebugMode (config) {
  if (config.debug === false) {
    config.fireWidth = 25
    config.fireHeight = 17
    config.debug = true
  } else {
    config.fireWidth = 60
    config.fireHeight = 40
    config.debug = false
  }

  createFireDataStructure(config)
  createFireSource(config)
  return config
}