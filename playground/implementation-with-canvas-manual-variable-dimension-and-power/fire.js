const fireCanvas = document.getElementById('fireCanvas');
const fireTable = document.getElementById('fireTable');
const context = fireCanvas.getContext('2d');

const firePixelsArray = [];
let pixelDimension = 4;
let fireWidth = 80;
let fireHeight = 56;
let fireBase = 36;
let debug = false;
let windy = true;
const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}];

function start() {
	canvasDimension(pixelDimension * fireWidth, pixelDimension * fireHeight);

	createFireDataStructure();
	createFireSource();

	setInterval(calculateFirePropagation, 50)
}

function createFireDataStructure() {
	for (let row = 0; row < fireHeight; row++) {
		firePixelsArray[row] = [];

		for (let column = 0; column < fireWidth; column++)
			firePixelsArray[row][column] = 0;
	}
}

function canvasDimension(width, height) {
    fireCanvas.setAttribute("width", width);
    fireCanvas.setAttribute("height", height);
}

function createFireSource() {
	let lastRow = fireHeight - 1;

	for (let column = 0; column < fireWidth; column++)
		firePixelsArray[lastRow][column] = fireBase;
}

function calculateFirePropagation() {
	for (let row = 0; row < fireHeight; row++)
		for (let column = 0; column < fireWidth; column++)
			updateFireIntensityPerPixel(row, column)

	renderFire();
}

function updateFireIntensityPerPixel(row, column) {
	const bottomRow = row + 1;

	if (bottomRow >= fireHeight)
		return;

	const decay = Math.floor(Math.random() * 3);
	const belowPixelFireIntensity = firePixelsArray[bottomRow][column];

	const newFireIntensity = belowPixelFireIntensity - decay;
	const currentFireIntensity = (newFireIntensity >= 0) ? newFireIntensity : 0;

	if (windy) {
		const rowPixelPosition = column - decay;
		const currentColumn = (rowPixelPosition < 0) ? (fireWidth + rowPixelPosition) : rowPixelPosition;
		firePixelsArray[row][currentColumn] = currentFireIntensity;
	}
	else
		firePixelsArray[row][column] = currentFireIntensity;
}

function renderFire() {
	let html = '';

	for (let row = 0; row < fireHeight; row++) {
		html += '<tr>';

		for (let column = 0; column < fireWidth; column++) {
			const pixelIndex = column + (fireWidth * row);
			const fireIntensity = firePixelsArray[row][column];
			const color = fireColorsPalette[fireIntensity];
			const colorString = `${color.r},${color.g},${color.b}`;

			if (debug) {
				html += '<td>';
				html += `<div class="pixel-index">${pixelIndex}</div>`;
				html += `<div style="color: rgb(${colorString})">${fireIntensity}</div>`;
				html += '</td>';
			} else {
				//html += `<td class="pixel" style="background-color: rgb(${colorString})"></td>`;
				context.fillStyle = `rgb(${colorString})`;
				context.fillRect(column * pixelDimension, row * pixelDimension, pixelDimension, pixelDimension);
			}
		}

		html += '</tr>';
	}

	if (debug)
		fireTable.innerHTML = html;
}

function toggleDebugMode() {
	if (debug) {
		debug = false;
		fireWidth *= pixelDimension;
		fireHeight *= pixelDimension;
		canvasDimension(pixelDimension * fireWidth, pixelDimension * fireHeight);
		fireTable.innerHTML = '';
	} else {
		debug = true;
		fireWidth /= pixelDimension;
		fireHeight /= pixelDimension;
		canvasDimension(0, 0);
	}

	createFireDataStructure();
	createFireSource();
}

function changeFireBase(value) {
	fireBase = value;
	createFireDataStructure();
	createFireSource();
}

function changePixelDimension(value) {
	pixelDimension = value;

	canvasDimension(pixelDimension * fireWidth, pixelDimension * fireHeight);

	createFireDataStructure();
	createFireSource();
}

function changeFireWidth(value) {
	fireWidth = value * pixelDimension;

	canvasDimension(pixelDimension * fireWidth, pixelDimension * fireHeight);

	createFireDataStructure();
	createFireSource();
}

function changeFireHeight(value) {
	fireHeight = value * pixelDimension;

	canvasDimension(pixelDimension * fireWidth, pixelDimension * fireHeight);

	createFireDataStructure();
	createFireSource();
}

start();