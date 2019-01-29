export function calculateFirePropagation (config) {
  for (let column = 0; column < config.fireWidth; column++) {
    for (let row = 0; row < config.fireHeight; row++) {
      const pixelIndex = column + (config.fireWidth * row)
      updateFireIntensityPerPixel(pixelIndex, config)
    }
  }
  return config
}

export function updateFireIntensityPerPixel (currentPixelIndex, config) {
    const belowPixelIndex = currentPixelIndex + config.fireWidth
    if (belowPixelIndex >= config.fireWidth * config.fireHeight) {
      return config
    }
    const decay = Math.floor(Math.random() * 3)
    const belowPixelFireIntensity = config.firePixelsArray[belowPixelIndex]
    const newFireIntensity =
    belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0
    config.firePixelsArray[currentPixelIndex - decay] = newFireIntensity
    return config
}

export function createFireDataStructure (config) {
  const numberOfPixels = config.fireWidth * config.fireHeight
  for (let i = 0; i < numberOfPixels; i++) {
    config.firePixelsArray[i] = 0
  }
  return config
}