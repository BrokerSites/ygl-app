import React, { useState, useRef } from 'react';
import { Box, Slider } from '@mui/material';

    const BedBathDropdown = ({ bedsBaths, onBedsBathsChange, isOpen, onToggle }) => {
    const bedBathButtonRef = useRef(null);

    const handleBedsBathsChange = (name, value) => {
        const newValues = { ...bedsBaths, [name]: value };
        onBedsBathsChange(newValues);
    };

    const formatValue = (value, type) => {
        if (value === '') return '';
        if (type === 'beds') return value === 0 ? 'Studio' : value >= 5 ? '5+' : value.toString();
        return value >= 5 ? '5+' : value.toString(); // Assuming same logic for baths
    };

    return (
        <div className="col-auto bb-btn">
            <button
                ref={bedBathButtonRef}
                className="btn btn-primary dropdown-toggle"
                onClick={onToggle}
            >
                Beds + Baths
            </button>
            {isOpen && (
                <Box className="bb-input-overlay">
                    <div className="slider-container">
                        <div className="slider-label">BEDS</div>
                        <Slider
                            value={bedsBaths.beds}
                            onChange={(event, newValue) => handleBedsBathsChange('beds', newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={5}
                            step={1}
                            valueLabelFormat={(value) => formatValue(value, 'beds')}
                            marks={[
                                { value: 0, label: 'Min' },
                                { value: 5, label: 'Max' },
                            ]}
                        />
                        <div className="input-container">
                            <input
                                className="option-input"
                                type="text"
                                name="beds-min"
                                value={formatValue(bedsBaths.beds[0], 'beds')}
                                onChange={(e) => handleBedsBathsChange('beds', [Number(e.target.value), bedsBaths.beds[1]])}
                                onClick={(e) => e.target.select()}
                            />
                            <input
                                className="option-input"
                                type="text"
                                name="beds-max"
                                value={formatValue(bedsBaths.beds[1], 'beds')}
                                onChange={(e) => handleBedsBathsChange('beds', [bedsBaths.beds[0], Number(e.target.value)])}
                                onClick={(e) => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className="slider-container">
                        <div className="slider-label">BATHS</div>
                        <Slider
                            value={bedsBaths.baths}
                            onChange={(event, newValue) => handleBedsBathsChange('baths', newValue)}
                            valueLabelDisplay="auto"
                            min={1}
                            max={5}
                            step={1}
                            valueLabelFormat={(value) => formatValue(value, 'baths')}
                            marks={[
                                { value: 1, label: 'Min' },
                                { value: 5, label: 'Max' }
                            ]}
                        />
                        <div className="input-container">
                            <input
                                className="option-input"
                                type="text"
                                name="baths-min"
                                value={formatValue(bedsBaths.baths[0], 'baths')}
                                onChange={(e) => handleBedsBathsChange('baths', [Number(e.target.value), bedsBaths.baths[1]])}
                                onClick={(e) => e.target.select()}
                            />
                            <input
                                className="option-input"
                                type="text"
                                name="baths-max"
                                value={formatValue(bedsBaths.baths[1], 'baths')}
                                onChange={(e) => handleBedsBathsChange('baths', [bedsBaths.baths[0], Number(e.target.value)])}
                                onClick={(e) => e.target.select()}
                            />
                        </div>
                    </div>
                </Box>
            )}
        </div>
    );
};

export default BedBathDropdown;
