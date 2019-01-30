const fireWidth = 60
const fireHeight = 40
const numberOfPixels = fireWidth * fireHeight

const columnUp = numberOfPixels - fireWidth

const canvas = document.getElementById('fireCanvas')
canvas.width = fireWidth
canvas.height = fireHeight
const context = canvas.getContext('2d')

canvas.addEventListener("mousemove", pointerMove);
canvas.addEventListener("touchmove", pointerMove);
canvas.addEventListener("mouseup", pointerRelease);
canvas.addEventListener("touchend", pointerRelease);
pointerInteractionEnabled = true;
pointerPositions = []

const image = context.createImageData(fireWidth, fireHeight)
const range = maxRange => [...Array(maxRange).keys()]
const firePixelsArray = [...Array(numberOfPixels).fill(0)]

const fireColorsPalette = [
  { r: 7, g: 7, b: 7 },
  { r: 31, g: 7, b: 7 },
  { r: 47, g: 15, b: 7 },
  { r: 71, g: 15, b: 7 },
  { r: 87, g: 23, b: 7 },
  { r: 103, g: 31, b: 7 },
  { r: 119, g: 31, b: 7 },
  { r: 143, g: 39, b: 7 },
  { r: 159, g: 47, b: 7 },
  { r: 175, g: 63, b: 7 },
  { r: 191, g: 71, b: 7 },
  { r: 199, g: 71, b: 7 },
  { r: 223, g: 79, b: 7 },
  { r: 223, g: 87, b: 7 },
  { r: 223, g: 87, b: 7 },
  { r: 215, g: 95, b: 7 },
  { r: 215, g: 95, b: 7 },
  { r: 215, g: 103, b: 15 },
  { r: 207, g: 111, b: 15 },
  { r: 207, g: 119, b: 15 },
  { r: 207, g: 127, b: 15 },
  { r: 207, g: 135, b: 23 },
  { r: 199, g: 135, b: 23 },
  { r: 199, g: 143, b: 23 },
  { r: 199, g: 151, b: 31 },
  { r: 191, g: 159, b: 31 },
  { r: 191, g: 159, b: 31 },
  { r: 191, g: 167, b: 39 },
  { r: 191, g: 167, b: 39 },
  { r: 191, g: 175, b: 47 },
  { r: 183, g: 175, b: 47 },
  { r: 183, g: 183, b: 47 },
  { r: 183, g: 183, b: 55 },
  { r: 207, g: 207, b: 111 },
  { r: 223, g: 223, b: 159 },
  { r: 239, g: 239, b: 199 },
  { r: 255, g: 255, b: 255 }
]

function calculateFirePropagation () {
  range(fireWidth).map(column =>
    range(fireHeight).map(row =>
      updateFireIntensityPerPixel(column + fireWidth * row)
    )
  )
}

function updateFireIntensityPerPixel(currentPixelIndex) {
  const belowPixelIndex = currentPixelIndex + fireWidth

  if (belowPixelIndex >= fireWidth * fireHeight) return

  const decay = Math.floor(Math.random() * 3)
  const belowPixelFireIntensity = firePixelsArray[belowPixelIndex]
  const newFireIntensity =
    belowPixelFireIntensity - decay >= 0
      ? belowPixelFireIntensity - decay
      : 0
  firePixelsArray[currentPixelIndex - decay] = newFireIntensity
}

function renderFire () {
  range(numberOfPixels).map(pixel => {
    const fireIntensity = firePixelsArray[pixel]
    const color = fireColorsPalette[fireIntensity]

    image.data[pixel * 4] = color.r
    image.data[pixel * 4 + 1] = color.g
    image.data[pixel * 4 + 2] = color.b
    image.data[pixel * 4 + 3] = 255
  })

  context.putImageData(image, 0, 0)
}

function createFireSource () {
  range(fireWidth).map(column =>
    range(fireHeight).map(row =>
      (firePixelsArray[columnUp + column] = 36))
  )
}

function increaseFireSource () {
  const increase = Math.floor(Math.random() * 14)
  range(fireWidth).map(column => {
    const pixelIndex = numberOfPixels - fireWidth + column
    const currentFireIntensity = firePixelsArray[pixelIndex]
    if (currentFireIntensity < 36) {
      const newFireIntensity =
        currentFireIntensity + increase >= 36
          ? 36
          : currentFireIntensity + increase

      firePixelsArray[pixelIndex] = newFireIntensity
    }
  })
}

function decreaseFireSource () {
  const decay = Math.floor(Math.random() * 14)
  range(fireWidth).map(column => {
    const pixelIndex = numberOfPixels - fireWidth + column
    const currentFireIntensity = firePixelsArray[pixelIndex]
    if (currentFireIntensity > 0) {
      const newFireIntensity =
        currentFireIntensity - decay >= 0
          ? currentFireIntensity - decay
          : 0
      firePixelsArray[pixelIndex] = newFireIntensity
    }
  })
}

function togglePointerInteraction (checkbox){
	pointerInteractionEnabled = checkbox.checked
}

function decreaseIntensityAroundPointer(){
	console.log(JSON.stringify(pointerPositions))
	let pointerPositionLength = pointerPositions.length;

	for(let i = 0; i< pointerPositionLength; i++){
		let relativePointerPosition = {x: pointerPositions[i].x - canvas.offsetLeft, y: pointerPositions[i].y - canvas.offsetTop};
		let pointerOnMatrix = {x: Math.round(relativePointerPosition.x / (canvas.clientWidth / fireWidth)) ,
								y: Math.round(relativePointerPosition.y / (canvas.clientHeight / fireHeight))}

		// HELL JUST LIKE DOOM
		firePixelsArray[(pointerOnMatrix.y - 1 * fireWidth) + pointerOnMatrix.x] = 0 ;
		firePixelsArray[(pointerOnMatrix.y - 1 * fireWidth) + pointerOnMatrix.x + 1] = 0 ;
		firePixelsArray[(pointerOnMatrix.y * fireWidth) + pointerOnMatrix.x + 1] = 0 ;
		firePixelsArray[(pointerOnMatrix.y + 1 * fireWidth) + pointerOnMatrix.x + 1] = 0 ;
		firePixelsArray[(pointerOnMatrix.y + 1 * fireWidth) + pointerOnMatrix.x] = 0 ;
		firePixelsArray[(pointerOnMatrix.y + 1 * fireWidth) + pointerOnMatrix.x - 1] = 0 ;
		firePixelsArray[(pointerOnMatrix.y * fireWidth) + pointerOnMatrix.x - 1] = 0 ;
		firePixelsArray[(pointerOnMatrix.y * fireWidth) + pointerOnMatrix.x] = 0 ;
	}
}

function pointerMove(event){
	event.preventDefault();

	if(event instanceof MouseEvent){
		pointerPositions[0] = {x: event.clientX, y: event.clientY};
	}else if(event instanceof TouchEvent){
		let touchesLength = event.touches.length;
		for(let i = 0; i < touchesLength; i++)
			pointerPositions[i] = {x: event.touches[event.changedTouches[i].identifier].clientX, y: event.touches[event.changedTouches[i].identifier].clientY};
	}
}

function pointerRelease(event){
	event.preventDefault();

	if(event instanceof MouseEvent){
		pointerPositions[0] = {};
	}else if(event instanceof TouchEvent){
		let changedTouchesLength = event.changedTouches.length;
		for(let i = 0; i < changedTouchesLength; i++)
			pointerPositions[event.changedTouches[i].identifier] = {};
	}
}

function start () {
  createFireSource()
  calculateFirePropagation()
  renderFire()
  loop()
}

function loop () {
  window.requestAnimationFrame(loop, canvas)
  if(pointerInteractionEnabled)
  	decreaseIntensityAroundPointer();
  calculateFirePropagation()
  renderFire()
}

function destroyFireSource () {
  range(fireWidth).map(column => {
    const pixelIndex = numberOfPixels - fireWidth + column
    firePixelsArray[pixelIndex] = 0
  })
}
start()
