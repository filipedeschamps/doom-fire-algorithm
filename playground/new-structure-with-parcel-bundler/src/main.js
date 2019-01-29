import defaultConfig from './config'
import * as handlers from './scripts/handlers'
import { createFireDataStructure, calculateFirePropagation } from './engines/js/fire'
import * as engines from './engines'
let config = { ...defaultConfig }
let tickers = []

function attatchButtonListeners (config) {
  for(let handlerKey in handlers) {
    const targetElement = document.getElementById(handlerKey)
    targetElement.onclick = () => config = handlers[handlerKey](config)
  }
}

function clearTickers () {
  tickers.forEach(clearInterval)
}

function runJSEngine (config) {
  clearTickers()
  tickers.push(setInterval(() => engines[config.engine].start(config), config.interval))
}

function runRustEngine (config) {
  clearTickers()
  tickers.push(setInterval(() => engines[config.engine].start(config), config.interval))
}

function showCurrentEngine (config) {
  document.getElementById('engine-info').innerHTML = config.engine
  document.getElementById('render-info').innerHTML = config.render
}

function start (config = config) {
  showCurrentEngine(config)
  attatchButtonListeners(config)

  if (config.engine === 'js') {
    runJSEngine(config)
  } else {
    runRustEngine(config)
  }
}


start(config)
window.start = start
