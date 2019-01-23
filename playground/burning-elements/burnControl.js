var burnControl = (function () {

  const burningElements = [];

  function burnElement(element) {

    let _id =
      (generateId = () =>
        (Math.random().toString(16)+"000000000").substr(2,8)
      )();

    const burningElement = (function (element) {

      let _fireWidth;
      let _fireHeight = 60;

      const _fireColorsPalette = ["#07070700", "#1f07071a", "#2f0f0742", "#470f077a", "#5717079c", "#671f07bf", "#771f07d6", "#8f2707", "#9f2f07", "#af3f07", "#bf4707", "#c74707", "#DF4F07", "#DF5707", "#DF5707", "#D75F07", "#D7670F", "#cf6f0f", "#cf770f", "#cf7f0f", "#CF8717", "#C78717", "#C78F17", "#C7971F", "#BF9F1F", "#BF9F1F", "#BFA727", "#BFA727", "#BFAF2F", "#B7AF2F", "#B7B72F", "#B7B737", "#cfcf6fab", "#dfdf9f82", "#efefc763", "#ffffff2e"];

      let _element = element;
      let burning = false;
      let _settings;

      let _firePixelsArray = [];
      let _fireElement;

      if(element) {
        element.setAttribute('burn-element__fire-id', _id);
        _createFireElement();
      }

      function start(settings) {
        _settings = settings;

        if(_settings && _settings.fireHeight) {
          _fireHeight = _settings.fireHeight;
        }

        _fireWidth = Math.floor(_element.clientWidth / 4) + 1;

        _createFireDataStructure();
        _createFireSource();

        burning = true;

        setInterval(_calculateFirePropagation, 50);
      }

      function _createFireElement() {
        _fireElement = document.createElement('div');
        _fireElement.id = _id;
        _fireElement.className = 'burn-elements-fire';
        _fireElement.style.top = _element.offsetTop - _fireHeight * 4 + 5;
        _fireElement.style.left = _element.offsetLeft;

        _element.parentElement.insertBefore(_fireElement, _element);
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
            const pixelIndex = column + (_fireWidth * row);

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
            const pixelIndex = column + (_fireWidth * row);
            const fireIntensity = _firePixelsArray[pixelIndex];
            const color = _fireColorsPalette[fireIntensity];
            html += `<td class="pixel" style="background-color: ${color}"></td>`;
          }

          html += '</tr>';
        }

        html += '</table>';

        _fireElement.innerHTML = html;
      }

      function _createFireSource() {
        for (let column = 0; column <= _fireWidth; column++) {
          const overflowPixelIndex = _fireWidth * _fireHeight;
          const pixelIndex = (overflowPixelIndex - _fireWidth) + column;

          _firePixelsArray[pixelIndex] = 36
        }
      }

      function stop() {
        for (let column = 0; column <= _fireWidth; column++) {
          const overflowPixelIndex = _fireWidth * _fireHeight;
          const pixelIndex = (overflowPixelIndex - _fireWidth) + column;

          _firePixelsArray[pixelIndex] = 0;
        }

        burning = false;
      }

      function toggle() {
        if(burning) {
          stop();
        }
        else {
          start();
        }
      }

      return {
        start,
        stop,
        toggle
      };

    }(element));

    burnControl.burningElements.push({
      id: _id,
      burningElement
    });

    return burningElement;
  }

  function toggleBurn(element) {
    const id = element.getAttribute('burn-element__fire-id');
    burningElements
      .find(burningElement => burningElement.id === id)
      .burningElement
      .toggle();
  }

  function startBurn(element) {
    const id = element.getAttribute('burn-element__fire-id');
    burningElements
      .find(burningElement => burningElement.id === id)
      .burningElement
      .start();
  }

  function stopBurn(element) {
    const id = element.getAttribute('burn-element__fire-id');
    burningElements
      .find(burningElement => burningElement.id === id)
      .burningElement
      .stop();
  }

  return {
    burnElement,
    burningElements,
    startBurn,
    stopBurn,
    toggleBurn
  };

}());