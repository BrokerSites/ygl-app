// PriceDropdown.js
import React, { useRef } from 'react';
import { Box, Slider } from '@mui/material';

const PriceDropdown = ({ minRent, maxRent, onRentChange }) => {
    const priceButtonRef = useRef(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newValue = Number(value);
        if (name === 'minRent') {
            onRentChange([newValue, maxRent]);
        } else if (name === 'maxRent') {
            onRentChange([minRent, newValue]);
        }
    };

    return (
        <div className="col-auto price-btn">
            <button
                ref={priceButtonRef}
                className="btn btn-primary dropdown-toggle"
                onClick={toggleDropdown}
            >
                Price
            </button>
            {isOpen && (
                <Box className="input-overlay">
                    <Slider
                        value={[minRent, maxRent]}
                        onChange={(event, newValue) => onRentChange(newValue)}
                        valueLabelDisplay="auto"
                        min={0}
                        max={10000}
                        step={100}
                    />
                    <div className='option-input-div'>
                        <input
                            className='option-input'
                            type="number"
                            name="minRent"
                            value={minRent}
                            onChange={handleInputChange}
                        />
                        <input
                            className='option-input'
                            type="number"
                            name="maxRent"
                            value={maxRent}
                            onChange={handleInputChange}
                        />
                    </div>
                </Box>
            )}
        </div>
    );
};

export default PriceDropdown;