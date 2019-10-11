import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const fireColorsPalette = [{ r: 7, g: 7, b: 7 }, { r: 31, g: 7, b: 7 }, { r: 47, g: 15, b: 7 }, { r: 71, g: 15, b: 7 }, { r: 87, g: 23, b: 7 }, { r: 103, g: 31, b: 7 }, { r: 119, g: 31, b: 7 }, { r: 143, g: 39, b: 7 }, { r: 159, g: 47, b: 7 }, { r: 175, g: 63, b: 7 }, { r: 191, g: 71, b: 7 }, { r: 199, g: 71, b: 7 }, { r: 223, g: 79, b: 7 }, { r: 223, g: 87, b: 7 }, { r: 223, g: 87, b: 7 }, { r: 215, g: 95, b: 7 }, { r: 215, g: 95, b: 7 }, { r: 215, g: 103, b: 15 }, { r: 207, g: 111, b: 15 }, { r: 207, g: 119, b: 15 }, { r: 207, g: 127, b: 15 }, { r: 207, g: 135, b: 23 }, { r: 199, g: 135, b: 23 }, { r: 199, g: 143, b: 23 }, { r: 199, g: 151, b: 31 }, { r: 191, g: 159, b: 31 }, { r: 191, g: 159, b: 31 }, { r: 191, g: 167, b: 39 }, { r: 191, g: 167, b: 39 }, { r: 191, g: 175, b: 47 }, { r: 183, g: 175, b: 47 }, { r: 183, g: 183, b: 47 }, { r: 183, g: 183, b: 55 }, { r: 207, g: 207, b: 111 }, { r: 223, g: 223, b: 159 }, { r: 239, g: 239, b: 199 }, { r: 255, g: 255, b: 255 }]

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firePixels: [],
      fireWidth: 60,
      fireHeight: 60,
    }
  }

  start = () => {
    this.createFire();
    this.createFireSource();

    setInterval(this.calculateFirePropagation, 1);
  }

  createFire = () => {
    const numberOfPixels = this.state.fireWidth * this.state.fireHeight;
    for (let i = 0; i < numberOfPixels; i++) {
      this.state.firePixels[i] = 0;
    }
  }

  updateFireIntensityPerPixel = currentPixelIndex => {
    const belowPixelIndex = currentPixelIndex + this.state.fireWidth;
    if (belowPixelIndex >= this.state.fireWidth * this.state.fireHeight) {
      return;
    }

    const decay = Math.floor(Math.random() * 3);
    const belowPixelFireIntensity = this.state.firePixels[belowPixelIndex];
    const newFireIntensity =
      belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;
    this.state.firePixels[currentPixelIndex - decay] = newFireIntensity;
  }

  calculateFirePropagation = () => {
    for (let c = 0; c < this.state.fireWidth; c++) {
      for (let r = 0; r < this.state.fireHeight; r++) {
        const pixelIndex = c + (r * this.state.fireWidth);
        this.updateFireIntensityPerPixel(pixelIndex);
      }
    }
    this.setState({ firePixels: this.state.firePixels });
  }

  createFireSource = () => {
    for (let i = 0; i < this.state.fireWidth; i++) {
      const overflowPixelIndex = this.state.fireWidth * this.state.fireHeight;
      const pixelIndex = (overflowPixelIndex - this.state.fireWidth) + i

      this.state.firePixels[pixelIndex] = 36;
    }
  }

  renderFire = () => {

  }

  componentWillMount() {
    this.start();
  }

  render() {
    const dim = Dimensions.get('window').width / 60;
    return (
      <View style={styles.container}>
        {
          this.state.firePixels.map((p, i) =>
            <View
              key={i}
              style={{
                width: dim,
                height: dim,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `rgba(${fireColorsPalette[p].r}, ${fireColorsPalette[p].g}, ${fireColorsPalette[p].b}, 1)`
              }}
            />
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(7, 7, 7, 1)',
    paddingTop: '71%'
  },
});