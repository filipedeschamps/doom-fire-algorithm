class FireCanvas {
  constructor(x, y, particleSize, pWidth, pLength, fHight, power, wind) {
    this.x = x;
    this.y = y;
    this.particleSize = particleSize;
    this.pWidth = pWidth;
    this.pLength = pLength;
    this.particles = [];
    this.fHight = fHight;
    this.power = power;
    this.wind = wind;
  }
  
  setPower(newPower)
  {
    this.power = newPower;
  }
  
  setFHeight(newHeight)
  {
    this.fHight = newHeight;
  }
  
  setWind(newWind)
  {
    this.wind = newWind;
    this.particles.forEach((x) => x.setWind(newWind));
  }

  update() {
    for (var j = 0; j < this.pLength; j++)
      this.particles.push(new FireParticle(this.x + (j * this.particleSize),
                          this.y + (this.pWidth * this.particleSize),
                          this.particleSize,
                          this.fHight,
                          this.power,
                          this.wind));
    
    this.particles.forEach((x) => x.update((particle) => {
      var index = this.particles.indexOf(particle);
      this.particles.splice(index, 1);
    }));
  }

  draw() {
    this.particles.forEach((x) => x.draw());
  }
}