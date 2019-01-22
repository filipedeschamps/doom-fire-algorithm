var burnElements = (function() {

  const _firePixelsArray = [];
  let _fireWidth = 60;
  let _fireHeight = 60;

  const _fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]

  let _debug = false;


  function start() {
    _createFireDataStructure();
    _createFireSource();

    setInterval(_calculateFirePropagation, 50);
  }

  function _createFireDataStructure() {
    const numberOfPixels = _fireWidth * _fireHeight;

    for (let i = 0; i < numberOfPixels; i++) {
      _firePixelsArray[i] = 0;
    }
  }

  function _calculateFirePropagation() {
    for (let column = 0; column < _fireWidth; column++) {
      for (let row = 0; row < _fireHeight; row++) {
        const pixelIndex = column + ( _fireWidth * row );

        _updateFireIntensityPerPixel(pixelIndex);
      }
    }

    _renderFire();
  }

  function _updateFireIntensityPerPixel(currentPixelIndex) {
    const belowPixelIndex = currentPixelIndex + _fireWidth;

    // below pixel index overflows canvas
    if (belowPixelIndex >= _fireWidth * _fireHeight) {
      return;
    }

    const decay = Math.floor(Math.random() * 3);
    const belowPixelFireIntensity = _firePixelsArray[belowPixelIndex];
    const newFireIntensity =
      belowPixelFireIntensity - decay >= 0
      ? belowPixelFireIntensity - decay
      : 0;

    _firePixelsArray[currentPixelIndex - decay] = newFireIntensity;
  }

  function _renderFire() {
    let html = '<table cellpadding=0 cellspacing=0>';

    for (let row = 0; row < _fireHeight; row++) {
      html += '<tr>'

      for (let column = 0; column < _fireWidth; column++) {
        const pixelIndex = column + ( _fireWidth * row );
        const fireIntensity = _firePixelsArray[pixelIndex];
        const color = _fireColorsPalette[fireIntensity];
        const colorString = `${color.r},${color.g},${color.b}`

        html +=
          _debug
          ? `
            <td>
              <div class="pixel-index">${pixelIndex}</div>
              <div style="color: rgb(${colorString})">${fireIntensity}</div>
            </td>`
          : `
            <td class="pixel" style="background-color: rgb(${colorString})">
            </td>`;
      }

      html += '</tr>';
    }

    html += '</table>';

    document.querySelector('#fireCanvas').innerHTML = html;
  }

  function _createFireSource() {
    for (let column = 0; column <= _fireWidth; column++) {
      const overflowPixelIndex = _fireWidth * _fireHeight;
      const pixelIndex = (overflowPixelIndex - _fireWidth) + column;

      _firePixelsArray[pixelIndex] = 36
    }
  }

  function _destroyFireSource() {
    for (let column = 0; column <= _fireWidth; column++) {
      const overflowPixelIndex = _fireWidth * _fireHeight;
      const pixelIndex = (overflowPixelIndex - _fireWidth) + column;

      _firePixelsArray[pixelIndex] = 0;
    }
  }

  function _increaseFireSource() {
    for (let column = 0; column <= _fireWidth; column++) {
      const overflowPixelIndex = _fireWidth * _fireHeight;
      const pixelIndex = (overflowPixelIndex - _fireWidth) + column;
      const currentFireIntensity = _firePixelsArray[pixelIndex];

      if (currentFireIntensity < 36) {
        const increase = Math.floor(Math.random() * 14)
        const newFireIntensity =
          currentFireIntensity + increase >= 36
          ? 36
          : currentFireIntensity + increase;

        _firePixelsArray[pixelIndex] = newFireIntensity;
      }
    }
  }

  function _decreaseFireSource() {
    for (let column = 0; column <= _fireWidth; column++) {
      const overflowPixelIndex = _fireWidth * _fireHeight;
      const pixelIndex = (overflowPixelIndex - _fireWidth) + column;
      const currentFireIntensity = _firePixelsArray[pixelIndex];

      if (currentFireIntensity > 0) {
        const decay = Math.floor(Math.random() * 14)
        const newFireIntensity =
          currentFireIntensity - decay >= 0
          ? currentFireIntensity - decay
          : 0;

        _firePixelsArray[pixelIndex] = newFireIntensity;
      }
    }
  }

  function toggleDebugMode() {
    if (!debug) {
      _fireWidth = 25
      _fireHeight = 17
      _debug = true
    } else {
      _fireWidth = 60
      _fireHeight = 40
      _debug = false
    }

    _createFireDataStructure();
    _createFireSource();
  }

  return {
    start,
    toggleDebugMode
  };

}());