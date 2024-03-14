import { Box } from '@mui/material';
import React, { useState } from 'react';

const MoveIn = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [moveInOption, setMoveInOption] = useState('Anytime');
    const [selectedDate, setSelectedDate] = useState('');

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleMoveInChange = (event) => {
        setMoveInOption(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <div className="col-auto mi-btn" style={{ position: 'relative' }}>
            <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                onClick={toggleDropdown}
            >
                Move-In
            </button>
            {isOpen && (
                <Box className="mi-input-overlay">
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
            )}
        </div>
    );
};

export default MoveIn;
