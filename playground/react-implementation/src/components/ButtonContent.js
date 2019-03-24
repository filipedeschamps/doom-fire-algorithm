import React from 'react';

const ButtonContent = (props) => {
    return (
        <div style={{textAlign: "center"}}>
            <button className="ui primary button" onClick={props.onDecreaseClicked}>-</button>
            <button className="ui primary button" onClick={props.onMinClick}>Min Fire</button>
            <button className="ui primary button" onClick={props.onMaxClick}>Max Fire</button>
            <button className="ui primary button" onClick={props.onIncreaseClick}>+</button>
            <br />
            <button className="ui primary button" 
                style={{marginTop:"4px"}} 
                onClick={props.onToggleDebugClick}
            >Toggle Debug Mode</button>
        </div>
    );
};

export default ButtonContent;