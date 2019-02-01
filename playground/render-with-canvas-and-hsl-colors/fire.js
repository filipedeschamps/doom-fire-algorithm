const firePixels = [];
const fireWidth  = 40;
const fireHeight = 40;
const pixelSize  = 10;
const elCanvas   = document.getElementById('fire');
const canvas     = elCanvas.getContext('2d');

function start() {
	defineCanvasSize();
	createFireDataStructure();
	createFireSource();
	calculateFirePropagation();
}

function createFireDataStructure() {
	const numberOfPixels = fireWidth * fireHeight;
	
	for (let i=0; i < numberOfPixels; i++) {
		firePixels[i] = 0;
	}
}

function calculateFirePropagation() {
	for (let col = 0; col < fireWidth; col++) {
		for (let row = 0; row < fireHeight; row++) {
			const pixelIndex = col + (fireWidth * row);
			
			updateFireIntensityPerPixel(pixelIndex);
		}
	}
	
	randerFire();
	
	requestAnimationFrame(calculateFirePropagation);
}

function updateFireIntensityPerPixel(currentPixelIndex) {
	const belowPixelIndex = currentPixelIndex + fireWidth;
	
	if (belowPixelIndex >= fireWidth * fireHeight)
		return;
	
	const decay = Math.floor(Math.random() * 7);
	const wind =  Math.floor(Math.random() * 1.3);
	const belowPixelFireIntensity = firePixels[belowPixelIndex];
	let newFireIntensity = belowPixelFireIntensity - decay;
	
	if (newFireIntensity <= 0)
		newFireIntensity = 0;
	
	firePixels[currentPixelIndex - wind] = newFireIntensity;
}

function defineCanvasSize() {
	elCanvas.width = fireWidth * pixelSize;
	elCanvas.height = fireHeight * pixelSize;
}

function createFireSource() {
	for (let col = 0; col < fireWidth; col++) {
		const overflowPixelIndex = fireWidth * fireHeight;
		const pixelIndex = (overflowPixelIndex - fireWidth) + col;

		firePixels[pixelIndex] = 100;
	}
}

function randerFire() {
	let x = 0;
	let y = 0;
	let index = 0;
	
  	canvas.clearRect(0, 0, pixelSize * fireWidth, pixelSize * fireHeight);

	for (let row = 0; row < fireHeight; row++) {
		y = row * pixelSize;
		
		for (let col = 0; col < fireWidth; col++) {
			x = col * pixelSize;
			index = col + (fireWidth * row);

			const colorH = Math.round(firePixels[index] * 40 / 100);
			const colorS = 100;
			const colorL = firePixels[index];

			const color = `hsl(${colorH}, ${colorS}%, ${colorL}%)`;

			canvas.beginPath();
			canvas.fillStyle = color;
			canvas.rect(x, y, pixelSize, pixelSize);
			canvas.fill();
		}
	}
}

start();