// RentRange.js
import React, { useState, useEffect } from 'react';

const RentRange = ({ minRent, setMinRent, maxRent, setMaxRent }) => {
  const [minValue, setMinValue] = useState(minRent);
  const [maxValue, setMaxValue] = useState(maxRent);

  useEffect(() => {
    setMinValue(minRent);
    setMaxValue(maxRent);
  }, [minRent, maxRent]);

  const handleMinValueChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    setMinValue(value);
  };

  const handleMaxValueChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    setMaxValue(value);
  };

  const handleMinInputBlur = () => {
    setMinRent(minValue);
  };

  const handleMaxInputBlur = () => {
    setMaxRent(maxValue);
  };

  return (
    <div className="rent-range">
      <input
        type="range"
        min="0"
        max="10000"
        value={minValue}
        onChange={handleMinValueChange}
        onMouseUp={handleMinInputBlur} // or onTouchEnd for mobile devices
        className="thumb thumb--left"
        style={{
          zIndex: 3, // Ensure the left thumb is over the right one
        }}
      />
      <input
        type="range"
        min="0"
        max="10000"
        value={maxValue}
        onChange={handleMaxValueChange}
        onMouseUp={handleMaxInputBlur} // or onTouchEnd for mobile devices
        className="thumb thumb--right"
        style={{
          zIndex: 2,
          marginTop: '-10px', // Stack on top of the left thumb
        }}
      />
      <div className="values">
        <span className="min-value">${minValue}</span>
        <span className="max-value">${maxValue}</span>
      </div>
    </div>
  );
};

export default RentRange;
