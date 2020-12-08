export default {
    get() {
        this.inputWidth = document.querySelector('.width')
        this.inputHeight = document.querySelector('.height')
        this.button = document.querySelector('.changeDimension')
        this.buttonDebug = document.querySelector('.debug')
    },

    set() {
        this.inputHeight.value = this.Config.fireHeight
        this.inputWidth.value = this.Config.fireWidth
    },

    actions() {
        this.button.onclick = () => this.toggleDimension({Width : parseInt(this.inputWidth.value), Height : parseInt(this.inputHeight.value)})
        this.buttonDebug.onclick = () => this.toggleDebugMode()
    },

    changeName() {
        if (this.Config.debug) {
            this.buttonDebug.innerHTML = "Desativar"
        } else {
            this.buttonDebug.innerHTML = "Ativar"
        }
    }
}