import { Box } from '@mui/material';
import React, { useState, useEffect } from 'react';

const MoveIn = ({ isOpen, buttonRef, onToggle }) => {
    
    const [moveInOption, setMoveInOption] = useState('Anytime');
    const [selectedDate, setSelectedDate] = useState('');
    const [dropdownStyle, setDropdownStyle] = useState({});

    const toggleDropdown = () => {
        if (onToggle) {
            onToggle(); // Call the onToggle prop, which should be connected to the parent's state management
        }
    };

    const handleMoveInChange = (event) => {
        setMoveInOption(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };


    useEffect(() => {
        if (buttonRef.current && isOpen) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                position: 'absolute',
                zIndex: 4000 // Ensure it's on top of other elements
            });
        }
    }, [buttonRef, isOpen]);

    return (  
        <Box className="mi-input-overlay" style={dropdownStyle}>
            <select 
                value={moveInOption}
                onChange={handleMoveInChange}
                className='mi-select'
            >
                <option value="Anytime">Anytime</option>
                <option value="Now">Now</option>
                <option value="Before">Before a Date</option>
                <option value="After">After a Date</option>
            </select>
            {(moveInOption === 'Before' || moveInOption === 'After') && (
                <input
                    type="date"
                    
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            )}
        </Box>
    );
};

export default MoveIn;
