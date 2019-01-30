import { main } from '../rust/Cargo.toml'
import renders from '../../renders'

function start (config) {
  const { fireWidth, fireHeight, debug, renderTargetId, render } = config
  let firePixelsArray = main({ fireWidth, fireHeight, debug, renderTargetId, firePixelsArray: [] })
  return renders[render]({ ...config, firePixelsArray })
}

export {
  start,
}
