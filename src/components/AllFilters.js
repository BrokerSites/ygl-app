import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import PriceDropdown from './PriceDropdown';
import BedBathDropdown from './BedBathDropdown';
import MoveIn from './MoveIn';

const AllFilters = ({ isOpen, buttonRef, onToggle }) => {
    const [filters, setFilters] = useState({
        // Add default filter states here
        petFriendly: false,
        freeParking: false,
        pool: false,
        // ... other filters
    });

    const [dropdownStyle, setDropdownStyle] = useState({});

    useEffect(() => {
        if (buttonRef.current && isOpen) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownStyle({
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                position: 'absolute',
                zIndex: 3000 // Ensure it's on top of other elements
            });
        }
    }, [buttonRef, isOpen]);

    const handleFilterChange = (filterName) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: !prevFilters[filterName],
        }));
    };

    if (!isOpen) return null;

    return (
        <Box className="af-input-overlay" style={dropdownStyle}>
            <form>
                <div>
                    <input
                        type="checkbox"
                        id="petFriendly"
                        checked={filters.petFriendly}
                        onChange={() => handleFilterChange('petFriendly')}
                    />
                    <label htmlFor="petFriendly">Pet Friendly</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="freeParking"
                        checked={filters.freeParking}
                        onChange={() => handleFilterChange('freeParking')}
                    />
                    <label htmlFor="freeParking">Free Parking</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="pool"
                        checked={filters.pool}
                        onChange={() => handleFilterChange('pool')}
                    />
                    <label htmlFor="pool">Pool</label>
                </div>
                {/* Add more filter options as needed */}
                {/* ... */}
            </form>
        </Box>
    );
};

export default AllFilters;
