let firePowerSlider, fireHeightSlider, windSlider;

const particleLength = 4;

var fireCanvas = new FireCanvas(-60 * particleLength,//x
                                0,//y
                                particleLength,//particleSize
                                100,//particles in canvas width
                                100 + 30 * particleLength,//particles in canvas length
                                17,//fire power
                                0);//wind

function setup() {  
  createCanvas(400, 400);
  textSize(20);
  
  firePowerSlider = createSlider(0, 35, 35);
  firePowerSlider.position(20, 10);
  
  fireHeightSlider = createSlider(0, 35, 17);
  fireHeightSlider.position(20, 45);
  
  windSlider = createSlider(-2, 2, 0);
  windSlider.position(20, 80);
  
  frameRate();
}

function draw() {
  background(0);
  
  const power = firePowerSlider.value();
  const fHeight = fireHeightSlider.value();
  const wind = windSlider.value();
  
  fireCanvas.setPower(power);
  text('Fire Power', firePowerSlider.x * 2 + firePowerSlider.width, 27);
  fireCanvas.setFHeight(fHeight);
  text('Fire Height', fireHeightSlider.x * 2 + fireHeightSlider.width, 63);
  fireCanvas.setWind(wind);
  text('Wind', windSlider.x * 2 + windSlider.width, 100);
  
  fireCanvas.update();
  fireCanvas.draw();
}