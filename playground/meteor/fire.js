const firePixels  = [];
const fireWidth   = 30;
const fireHeight  = 50;
const pixelWidth  = 3;
const pixelHeight = 10;

const elCanvas    = document.getElementById('fire');
const canvas      = elCanvas.getContext("2d");

function start() {
	defineCanvasSize();
	createFireDataStructure();
	createFireSource();
	calculateFirePropagation();	
	
	setInterval(function() {
		createFireSource();
	}, 1000);
}

function createFireDataStructure() {
	const numberOfPixels = fireWidth * fireHeight;
	
	for (let i=0; i < numberOfPixels; i++) {
		firePixels[i] = { fireIintensity: 0, windIntensity: 0 };
	}
}

function calculateFirePropagation() {
	for (let col = 0; col < fireWidth; col++) {
		for (let row = 0; row < fireHeight; row++) {
			const pixelIndex = col + (fireWidth * row);
			updateFireIntensityPerPixel(pixelIndex);
		}
	}

	renderFire();
	
	requestAnimationFrame(calculateFirePropagation);
}

function updateFireIntensityPerPixel(currentPixelIndex) {
	const belowPixelIndex = currentPixelIndex + fireWidth;
	
	if (belowPixelIndex >= fireWidth * fireHeight)
		return;
	
	const fireIintensityDecay = Math.floor(Math.random() * 7);
	const windIntensityDecay = Math.floor(Math.random() * 20);

	const belowPixelFireIntensity = firePixels[belowPixelIndex].fireIintensity;
	const belowPixelFireWind = firePixels[belowPixelIndex].windIntensity;

	let newFireIntensity = belowPixelFireIntensity - fireIintensityDecay;
	let newWindIntensity = 0;
	let changeIndex = 0;
	
	if (newFireIntensity <= 0) {
		newFireIntensity = 0;
	}

	if (belowPixelFireWind > 0) {
		newWindIntensity = belowPixelFireWind - windIntensityDecay;
		changeIndex = belowPixelFireWind > 10 ? 1 : 0;
	} else if (belowPixelFireWind < 0) {
		newWindIntensity = belowPixelFireWind + windIntensityDecay;
		changeIndex = belowPixelFireWind < -10 ? -2 : 0;
	}
	
	firePixels[currentPixelIndex - changeIndex] = { fireIintensity: newFireIntensity, windIntensity: newWindIntensity };
}

function defineCanvasSize() {
	elCanvas.width = fireWidth * pixelWidth;
	elCanvas.height = fireHeight * pixelHeight;
}

function createFireSource() {
	for (let col = 0; col < fireWidth; col++) {
		const overflowPixelIndex = fireWidth * fireHeight;
		const pixelIndex = (overflowPixelIndex - fireWidth) + col;
		
		const fireIintensity = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
		const windIntensityDirection = Math.random() < 0.5 ? -1 : 1;
		const windIntensity = Math.floor(Math.random() * 20) * windIntensityDirection;

		firePixels[pixelIndex] = { fireIintensity: fireIintensity, windIntensity: windIntensity };
	}
}

function renderFire() {
	let x = 0;
	let y = 0;
	let index = 0;
	
  	canvas.clearRect(0,0, pixelWidth * fireWidth, pixelHeight * fireHeight);

	for (let row = 0; row < fireHeight; row++) {
		y = row * pixelHeight;
		
		for (let col = 0; col < fireWidth; col++) {
			x = col * pixelWidth;
			index = col + (fireWidth * row);

			const colorH = Math.round(firePixels[index].fireIintensity * 40 / 100);
			const colorS = 100;
			const colorL = firePixels[index].fireIintensity;
			const color = `hsl(${colorH}, ${colorS}%, ${colorL}%)`;
			
			const rotate = (firePixels[index].windIntensity) * Math.PI / 180;
			
			// Debug
			// canvas.beginPath();
			// canvas.strokeRect(x, y, pixelSize, pixelSize);

			canvas.save();
			
			canvas.beginPath();
			
			canvas.translate(x + (pixelWidth / 2), y + pixelHeight);
			canvas.rotate(rotate);
			
			canvas.moveTo(0, 0);
			canvas.lineTo(0, pixelHeight * -1);
			
			canvas.strokeStyle = color;
			canvas.lineWidth = 1;
			canvas.stroke();

			canvas.restore();
			
			canvas.beginPath();
			canvas.fillStyle = 'black';
			canvas.fillRect(0, pixelHeight * (fireHeight - 1), pixelWidth * fireWidth, pixelHeight);
		}
	}
}

start();