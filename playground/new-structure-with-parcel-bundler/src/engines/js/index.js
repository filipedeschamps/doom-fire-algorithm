import { createFireSource } from '../../scripts/handlers'
import { createFireDataStructure, calculateFirePropagation } from './fire'
import renders from '../../renders'

export function start (config) {
  if (!config.firePixelsArray.length) {
    config = createFireDataStructure(config)
    config = createFireSource(config)
  }
  config = calculateFirePropagation(config)
  return renders[config.render](config)
}