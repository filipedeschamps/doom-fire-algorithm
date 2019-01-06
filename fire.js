const firePixelsArray = []
let fireWidth = 60
let fireHeight = 40
let debug = false
const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]


function start() {
  createFireDataStructure()
  createFireSource()

  setInterval(calculateFirePropagation, 50)
}

function createFireDataStructure() {
  const numberOfPixels = fireWidth * fireHeight

  for (let i = 0; i < numberOfPixels; i++) {
    firePixelsArray[i] = 0
  }
}

function calculateFirePropagation() {
  for (let column = 0; column < fireWidth; column++) {
    for (let row = 0; row < fireHeight; row++) {
      const pixelIndex = column + ( fireWidth * row )

      updateFireIntensityPerPixel(pixelIndex)
    }
  }

  renderFire()
}

function updateFireIntensityPerPixel(currentPixelIndex) {
  const belowPixelIndex = currentPixelIndex + fireWidth

  // below pixel index overflows canvas
  if (belowPixelIndex >= fireWidth * fireHeight) {
    return
  }

  const decay = Math.floor(Math.random() * 3)
  const belowPixelFireIntensity = firePixelsArray[belowPixelIndex]
  const newFireIntensity =
    belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0

  firePixelsArray[currentPixelIndex - decay] = newFireIntensity
}

function renderFire() {
  let html = '<table cellpadding=0 cellspacing=0>'

  for (let row = 0; row < fireHeight; row++) {
    html += '<tr>'

    for (let column = 0; column < fireWidth; column++) {
      const pixelIndex = column + ( fireWidth * row )
      const fireIntensity = firePixelsArray[pixelIndex]
      const color = fireColorsPalette[fireIntensity]
      const colorString = `${color.r},${color.g},${color.b}`

      if (debug === true) {
        html += '<td>'
        html += `<div class="pixel-index">${pixelIndex}</div>`
        html += `<div style="color: rgb(${colorString})">${fireIntensity}</div>`
        html += '</td>'
      } else {
        html += `<td class="pixel" style="background-color: rgb(${colorString})">`
        html += '</td>'
      }
    }

    html += '</tr>'
  }

  html += '</table>'

  document.querySelector('#fireCanvas').innerHTML = html  
}

function getFireIntensity(pixelIndex, increasing, calc) {
  firePixelsArray[pixelIndex] = calc >= (increasing ? 36 : 0)
    ? increasing ? 36 : calc
    : increasing ? calc : 0
}

function manipulateFireSource(type, increasing) {
  for (let column = 0; column <= fireWidth; column++) {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column

    if (type === 'creation') { firePixelsArray[pixelIndex] = increasing ? 36 : 0 }

    if (type === 'manipulation') {
      const currentFireIntensity = firePixelsArray[pixelIndex]
      const fireManipulation = Math.floor(Math.random() * 14)

      if (increasing && currentFireIntensity < 36) { getFireIntensity(pixelIndex, increasing, (currentFireIntensity + fireManipulation)) }
      if (!increasing && currentFireIntensity > 0) { getFireIntensity(pixelIndex, increasing, (currentFireIntensity - fireManipulation)) }
    }
  }
}

function createFireSource() { manipulateFireSource('creation', true) }
function destroyFireSource() { manipulateFireSource('creation', false) }
function increaseFireSource() { manipulateFireSource('manipulation', true) }
function decreaseFireSource() { manipulateFireSource('manipulation', false) }

function toggleDebugMode() {
  if (debug === false) {
    fireWidth = 25
    fireHeight = 17
    debug = true
  } else {
    fireWidth = 60
    fireHeight = 40
    debug = false
  }

  createFireDataStructure()
  createFireSource()
}

start()
