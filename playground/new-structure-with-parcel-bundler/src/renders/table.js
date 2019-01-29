import fireColorsPalette from '../scripts/colors'

function generateRenderedFireHtml (config) {
  let html = '<table cellpadding=0 cellspacing=0>'

  for (let row = 0; row < config.fireHeight; row++) {
    html += '<tr>'
    for (let column = 0; column < config.fireWidth; column++) {
      const pixelIndex = column + (config.fireWidth * row)
      const fireIntensity = config.firePixelsArray[pixelIndex]
      const {r, g, b} = fireColorsPalette[fireIntensity]
      const colorString = `${r},${g},${b}`
      html += `<td class='pixel' style='background-color: rgb(${colorString})'></td>`
    }
    html += '</tr>'
  }
  html += '</table>'
  return html
}

export function renderFire (config, htmlGenerator = generateRenderedFireHtml) {
  document.querySelector(config.renderTargetId).innerHTML = htmlGenerator(config)
}