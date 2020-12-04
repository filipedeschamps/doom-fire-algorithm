const buttons = document.querySelectorAll('#controls button');

const operation = {
  decrease() {
    decayDelta = decayDelta < 12 ? decayDelta + 1 : decayDelta;
  },
  min() {
    decayDelta = 10;
  },
  debug() {
    debug = !debug;

    pixelSize = debug ? 10 : 5;

    canvas.width = fireWidth * pixelSize;
    canvas.height = fireHeight * pixelSize;
  },
  max() {
    decayDelta = 2;
  },
  increase() {
    decayDelta = decayDelta > 2 ? decayDelta - 1 : decayDelta;
  }
}

buttons.forEach(button => {
  button.addEventListener('click', handleOperation);
})

function handleOperation({ target }) {
  operation[target.id]();
}
