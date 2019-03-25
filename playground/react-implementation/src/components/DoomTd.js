import React from 'react';
import './DoomTd.css'

const DoomTd = ({debugMode, pixelIndex, fireIntensity, fireColorsPalette}) => {
    const color = fireColorsPalette[fireIntensity];
    const colorString = `${color.r},${color.g},${color.b}`;

    if (pixelIndex === 0) {
        // console.log("2" +debugMode);
    }

    if (debugMode) {
        return (
            <td>
                <div className="pixel-index">
                    {pixelIndex}
                </div>
                {fireIntensity}
            </td>
        );
    }
    return (
        <td className="pixel"
            style={{backgroundColor: `rgb(${colorString})`}}
        >
        </td>
    );

};

export default DoomTd;

/* colors
[{"r":7,"g":7,"b":7},
{"r":31,"g":7,"b":7},
{"r":47,"g":15,"b":7},
{"r":71,"g":15,"b":7},
{"r":87,"g":23,"b":7},
{"r":103,"g":31,"b":7},
{"r":119,"g":31,"b":7},
{"r":143,"g":39,"b":7},
{"r":159,"g":47,"b":7},
{"r":175,"g":63,"b":7},
{"r":191,"g":71,"b":7},
{"r":199,"g":71,"b":7},
{"r":223,"g":79,"b":7},
{"r":223,"g":87,"b":7},
{"r":223,"g":87,"b":7},
{"r":215,"g":95,"b":7},
{"r":215,"g":95,"b":7},
{"r":215,"g":103,"b":15},
{"r":207,"g":111,"b":15},
{"r":207,"g":119,"b":15},
{"r":207,"g":127,"b":15},
{"r":207,"g":135,"b":23},
{"r":199,"g":135,"b":23},
{"r":199,"g":143,"b":23},
{"r":199,"g":151,"b":31},
{"r":191,"g":159,"b":31},
{"r":191,"g":159,"b":31},
{"r":191,"g":167,"b":39},
{"r":191,"g":167,"b":39},
{"r":191,"g":175,"b":47},
{"r":183,"g":175,"b":47},
{"r":183,"g":183,"b":47},
{"r":183,"g":183,"b":55},
{"r":207,"g":207,"b":111},
{"r":223,"g":223,"b":159},
{"r":239,"g":239,"b":199},
{"r":255,"g":255,"b":255}]
*/