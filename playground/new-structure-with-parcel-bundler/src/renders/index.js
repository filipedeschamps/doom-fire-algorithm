import { renderFire as table } from './table'
import { renderFire as canvas } from './canvas'
import { renderFire as tableDebug } from './table-debug'
import { renderFire as pixi } from './pixi'

export default {
  table,
  canvas,
  ['table-debug']: tableDebug,
  pixi,
}