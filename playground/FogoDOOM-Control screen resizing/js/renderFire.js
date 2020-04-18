export default { 
    Pixel : {
        firePixelsArray : [],
    },

    renderFire(Config) {
        let html = '<table cellpadding=0 cellspacing=0>'
        for (let row = 0; row < Config.fireHeight; row++) {
            html += '<tr>'
            for (let column = 0; column < Config.fireWidth; column++) {
                const pixelIndex = column + (Config.fireWidth * row)
                const fireIntensity = this.Pixel.firePixelsArray[pixelIndex]
                const color = Config.fireColorsPalette[fireIntensity]
                const colorString = `${color.r}, ${color.g}, ${color.b}`
                if (Config.debug) {
                    html += '<td style="background-color: black">'
                    html += `<div class="pixel-index">${pixelIndex}</div>`
                    html += `<span style="color:rgb(${colorString})">${fireIntensity}</span`
                    html += '</td>'
                } else {
                    html += `<td class="pixel" style="background-color: rgb(${colorString})">`
                    html += `</td>`
                }
            }
            html += '</tr>'
        }
        html += '</table>'
        document.querySelector('#fireCanvas').innerHTML = html
    },

    createFireStructure(Config) {
        const numberOfPixels = Config.fireWidth * Config.fireHeight
        for (let i = 0; i < numberOfPixels; i++) {
           this.Pixel.firePixelsArray[i] = 0
        }
    },

    createFireSource(Config) {
        for (let column = 0; column < Config.fireWidth; column++) {
            const overFlowPixel = Config.fireWidth * Config.fireHeight
            const pixelIndex = (overFlowPixel - Config.fireWidth) + column
            this.Pixel.firePixelsArray[pixelIndex] = 36
        }
    },

    UpdateFireIntensityPerPixel(Config, currentPixelIndex) {
        const belowPixelIndex = currentPixelIndex + Config.fireWidth

        if (belowPixelIndex >= Config.fireWidth * Config.fireHeight) {
            return 
        }

        const decay = Math.floor(Math.random() * 3)
        const belowPixelFireIntesity = this.Pixel.firePixelsArray[belowPixelIndex]
        let newFireIntensity;
        if (belowPixelFireIntesity - decay >= 0) {
            newFireIntensity = belowPixelFireIntesity - decay 
        }else {
          newFireIntensity = 0
        }
        this.Pixel.firePixelsArray[currentPixelIndex - decay] = newFireIntensity
    }
}