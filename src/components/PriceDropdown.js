import React, {useEffect, useState } from 'react';
import { Box, Slider } from '@mui/material';

const PriceDropdown = ({ minRent, maxRent, onRentChange, isOpen, buttonRef }) => {

    const [dropdownStyle, setDropdownStyle] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newValue = Number(value);
        if (name === 'minRent') {
            onRentChange([newValue, maxRent]);
        } else if (name === 'maxRent') {
            onRentChange([minRent, newValue]);
        }
    };

    useEffect(() => {
        if (buttonRef.current && isOpen) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                top: `${rect.bottom + window.scrollY}px`, // Y position
                left: `${rect.left + window.scrollX}px`, // X position
                position: 'absolute'
            });
        }
    }, [buttonRef, isOpen]);

    if (!isOpen) return null;

    return (
        <Box className="input-overlay" style={dropdownStyle} >
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
    );
};

export default PriceDropdown;
