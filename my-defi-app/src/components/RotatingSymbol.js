import React from 'react';
import './RotatingSymbol.scss'; // Import the CSS file

const RotatingSymbol = () => {
  return (
    <div className="wrapper">
      <div className="pyramid">
        <div className="square">
          <div className="triangle"></div>
          <div className="triangle"></div>
          <div className="triangle"></div>
          <div className="triangle"></div>
        </div>
      </div>

      <div className="pyramid inverse">
        <div className="square">
          <div className="triangle"></div>
          <div className="triangle"></div>
          <div className="triangle"></div>
          <div className="triangle"></div>
        </div>
      </div>
    </div>
  );
};

export default RotatingSymbol;
