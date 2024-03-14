import React, {useRef, useEffect, useState } from 'react';
import { Box, Slider } from '@mui/material';

const PriceDropdown = ({ minRent, maxRent, onRentChange, isOpen, buttonRef, setRef }) => {
    const dropdownRef = useRef(null); // Ref for the dropdown itself
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
        if (isOpen) {
            setRef(dropdownRef.current);
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const dropdownWidth = dropdownRef.current.offsetWidth;
            setDropdownStyle({
                display: 'block', // Make sure the dropdown is visible when it's open
                top: `${buttonRect.bottom + window.scrollY}px`, // Position below the button
                // Subtract the dropdown width from the button's right edge position to align their right edges
                left: `${buttonRect.right - dropdownWidth + window.scrollX}px`,
                position: 'absolute'
            });
        }
    }, [isOpen, buttonRef, setRef, dropdownRef]);

    if (!isOpen) return null;

    return (
        <Box className="input-overlay" ref={dropdownRef} style={dropdownStyle} onClick={(e) => e.stopPropagation()} >
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
