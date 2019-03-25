import React, { Component } from 'react';
import './App.css';
import DoomTr from './DoomTr';
import DoomTd from './DoomTd';
import ButtonContent from './ButtonContent';

const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]
const fireRows = 50; // height
const fireColumns = 50; // width

class App extends Component {
    rows = [];
    firePixelsArray = [];
    
    constructor(props) {
        super(props);
        this.state = {debugMode: false, rows: []};

        for (let i = 0; i < (fireRows * fireColumns); i++) {
            this.firePixelsArray[i] = 0;        
        }
    }

    componentDidMount() {
        this.start();
    }

    renderColumns(i) {
        let columns = [];
        
        for (let j = 0; j < fireColumns; j++) {
            let pixelIndex = (i * fireColumns) + j;
            columns[j] = <DoomTd key={pixelIndex}
                debugMode={this.state.debugMode} 
                pixelIndex={pixelIndex} 
                fireIntensity={this.firePixelsArray[pixelIndex]} 
                fireColorsPalette={fireColorsPalette}
            />;
        }
        return columns;
    }

    renderRows = async() => {
        for (let i = 0; i < fireRows; i++) {
            this.rows[i] = <DoomTr key={i}>
                {this.renderColumns(i)}
            </DoomTr>;
        } 
        await this.setState({rows: this.rows});
    }
    
    createFireSource = () => {
        const startPixel = (fireColumns * fireRows) - fireColumns;
        for (let j = 0; j < fireColumns; j++) {
            this.firePixelsArray[startPixel + j] = fireColorsPalette.length - 1;
        }
    }
    
    destroyFireSource = () => {
        const startPixel = (fireColumns * fireRows) - fireColumns;
        for (let j = 0; j < fireColumns; j++) {
            this.firePixelsArray[startPixel + j] = 0;
        }
    }

    start = () => {
        this.createFireSource();
        this.renderRows();

        setInterval(this.calculateFirePropagation, 100);
    }
    
    calculateFirePropagation = async() => {
        for (let j = 0; j < fireColumns; j++) {
            for (let i = 0; i < fireRows; i++) {
                const pixelIndex = j + (fireColumns * i);
                this.updateFireIntensityPerPixel(pixelIndex);
            }
        }
        await this.renderRows();
    }

    updateFireIntensityPerPixel = (currentPixelIndex) => {
        const belowPixelIndex = currentPixelIndex + fireColumns;
        if (belowPixelIndex >= fireColumns * fireRows) {
          return;
        }
        const decay = Math.floor(Math.random() * 2.6);
        const belowPixelFireIntensity = this.firePixelsArray[belowPixelIndex];
        const newFireIntensity = belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;
      
        this.firePixelsArray[currentPixelIndex - decay] = newFireIntensity;
    }

    decreaseFireSource = () => {
        const startPixel = (fireColumns * fireRows) - fireColumns;
        for (let j = 0; j < fireColumns; j++) {
            const currentFireIntensity = this.firePixelsArray[startPixel + j];
            const decrease = Math.floor(Math.random() * 5);
            const newFireIntensity = (currentFireIntensity - decrease) > 0 ? 
                                      currentFireIntensity - decrease : 0;
            this.firePixelsArray[startPixel + j] = newFireIntensity;
        }
    }

    increaseFireSource = () => {
        const startPixel = (fireColumns * fireRows) - fireColumns;
        const paletteLength = fireColorsPalette.length - 1;
        
        for (let j = 0; j < fireColumns; j++) {
            const currentFireIntensity = this.firePixelsArray[startPixel + j];
            const increase = Math.floor(Math.random() * 5);
            const newFireIntensity = (currentFireIntensity + increase) < paletteLength ? 
                                      currentFireIntensity + increase : paletteLength;
            this.firePixelsArray[startPixel + j] = newFireIntensity;
        }
    }

    toggleDebugMode = async() => {
        await this.setState((state) => ({debugMode: !state.debugMode}));
        console.log("1" + this.state.debugMode);
    }

    render() {
        return (
            <div className="container-center">
                <div>
                    <table cellPadding="0" cellSpacing="0"
                        style={{margin:"auto", borderCollapse: "collapse",
                        marginBottom: "10px"}}
                        >
                        <tbody>
                            {this.state.rows}
                        </tbody>
                    </table>
                    <ButtonContent 
                        onDecreaseClicked={this.decreaseFireSource} 
                        onMinClick={this.destroyFireSource}
                        onMaxClick={this.createFireSource}
                        onIncreaseClick={this.increaseFireSource}
                        onToggleDebugClick={this.toggleDebugMode}
                    />
                </div>
            </div>
        );
            
    }
}
        
export default App;