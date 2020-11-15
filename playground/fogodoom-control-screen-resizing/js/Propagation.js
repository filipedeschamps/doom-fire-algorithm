import Elements from './dom/Elements.js'
import Render from './renderFire.js'

export default {
    Config : {
        fireWidth : 10,
        fireHeight : 10,
        debug : false,
        time : 1,
        fireColorsPalette : [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}],
    },

    start() {
        Elements.get.call(this)
        Elements.set.call(this)
        Elements.actions.call(this)
        Render.createFireStructure(this.Config)
        Render.createFireSource(this.Config)
        setInterval(() => {
            this.calculateFirePropagation()
        }, this.Config.time)
    },

    createFireDataStructure() {
        const numberOfPixels = this.Config.fireWidth * this.Config.fireHeight
        for (let i = 0; i < numberOfPixels; i++) {
          Render.Pixel.firePixelsArray[i] = 0
        }
    },

    calculateFirePropagation() {
        for (let column = 0; column < this.Config.fireWidth; column++) {
            for (let row = 0; row < this.Config.fireHeight; row++) {
                const pixelIndex = column + (this.Config.fireWidth * row)
                Render.UpdateFireIntensityPerPixel(this.Config, pixelIndex)
            }
        }
        Render.renderFire(this.Config)
    },

    toggleDimension (data) {
        this.Config.fireWidth = data.Width
        this.Config.fireHeight = data.Height
        this.createFireDataStructure()
        Render.createFireSource(this.Config)
    },

    toggleDebugMode () {
        this.Config.debug = !this.Config.debug
        Elements.changeName.call(this)
    },
}