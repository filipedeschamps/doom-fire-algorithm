const palette = ['rgb(7, 7, 7)', 'rgb(31, 7, 7)', 'rgb(47, 15, 7)', 'rgb(71, 15, 7)', 'rgb(87, 23, 7)', 'rgb(103, 31, 7)', 'rgb(119, 31, 7)', 'rgb(143, 39, 7)', 'rgb(159, 47, 7)', 'rgb(175, 63, 7)', 'rgb(191, 71, 7)', 'rgb(199, 71, 7)', 'rgb(223, 79, 7)', 'rgb(223, 87, 7)', 'rgb(223, 87, 7)', 'rgb(215, 95, 7)', 'rgb(215, 95, 7)', 'rgb(215, 103, 15)', 'rgb(207, 111, 15)', 'rgb(207, 119, 15)', 'rgb(207, 127, 15)', 'rgb(207, 135, 23)', 'rgb(199, 135, 23)', 'rgb(199, 143, 23)', 'rgb(199, 151, 31)', 'rgb(191, 159, 31)', 'rgb(191, 159, 31)', 'rgb(191, 167, 39)', 'rgb(191, 167, 39)', 'rgb(191, 175, 47)', 'rgb(183, 175, 47)', 'rgb(183, 183, 47)', 'rgb(183, 183, 55)', 'rgb(207, 207, 111)', 'rgb(223, 223, 159)', 'rgb(239, 239, 199)', 'rgb(255, 255, 255)']
const canvas = document.createElement('canvas')
const canvasCtx = canvas.getContext('2d')
const fire = {
  height: 120,
  width: 200,
}

const area = fire.height * fire.width

const pixels = {
  size: 4,
  total: fire.height * fire.width,
  array: [],
}

let textDataStructure = []

const bottomMargin = 5
let decayMultiplier = 3

let textDataStructureHeight, topMargin

document.getElementById('text-on-fire').addEventListener('blur', start)

function writeTextOnCanvas(text) {
  canvasCtx.font = '30px Helvetica'
  canvasCtx.fillStyle = "#fff"
  canvasCtx.fillText(text, 1, 50)

  textData = canvasCtx.getImageData(-10, 1, canvas.width, canvas.height).data
  createTextDataStructure(textData)

  textDataStructureHeight = (textDataStructure.length) / fire.width
  topMargin = fire.width * (fire.height - textDataStructureHeight - bottomMargin)
}

function createTextDataStructure(textData) {
  textDataStructure = []
  for(let i = 0; i < textData.length; i += 4) {
    if (textData[i] == 255 && textData[i+1] == 255 && textData[i+2] == 255) {
      textDataStructure.push(1)
    }

    if (textData[i] == 0 && textData[i+1] == 0 && textData[i+2] == 0) {
      textDataStructure.push(0)
    }
  }
}

function start() {
  canvas.width = 200
  canvas.height = 50

  const userInput = document.getElementById('text-on-fire').value
  writeTextOnCanvas(userInput)

  canvas.width = fire.width * pixels.size
  canvas.height = fire.height * pixels.size

  createFireDataStructure()
  createFireSource()

  document.querySelector('#canvas').appendChild(canvas)

  setInterval(calculateFirePropagation, 50)
  renderFire()
}

function createFireDataStructure() {
  for (let i = 0; i < area; i++) {
    pixels.array[i] = 0
  }
}

function createFireSource() {
  for (let index = topMargin; index < area; index++) {
    pixels.array[index] = textDataStructure[index - topMargin] * 30
  }
}

function calculateFirePropagation() {
  for (let column = 0; column < fire.width; column++) {
    for (let row = 0; row < fire.height; row++) {
      const index = column + (fire.width * row)

      updateFireIntensityPerPixel(index)
    }
  }

  renderFire()
}

function updateFireIntensityPerPixel(pixel) {
  const decay = Math.floor(Math.random() * 2)
  const pixelBelow = pixel + fire.width
  let newIntensity

  if (pixelBelow >= fire.width * fire.height) {
    return
  }

  const intensityBelow = pixels.array[pixelBelow]

  if (intensityBelow - decay >= 0) {
    newIntensity = intensityBelow - (decay * decayMultiplier)
  } else {
    newIntensity = 0
  }

  if (textDataStructure[(pixel - decay) - topMargin] > 0) {
    return
  }

  pixels.array[pixel - decay] = newIntensity
}

function renderFire() {
  for (let row = 0; row < fire.height; row++) {
    for (let column = 0; column < fire.width; column++) {
      const index = column + (fire.width * row)

      const intensity = pixels.array[index]
      const color = palette[intensity]

      canvasCtx.fillStyle = ` ${color}`
      canvasCtx.fillRect(column * pixels.size, row * pixels.size, pixels.size, pixels.size)
    }
  }
}

function increaseFire() {
  if (decayMultiplier > 1) {
    decayMultiplier--
  }
}

function decreaseFire() {
  if (decayMultiplier < 15) {
    decayMultiplier++
  }
}

function minimumFire() {
  decayMultiplier = 15
}

function maximumFire() {
  decayMultiplier = 1
}

start()
