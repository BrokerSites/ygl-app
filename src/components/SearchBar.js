import React, { useState, } from 'react';
import Autocomplete from './Autocomplete';
import TagBox from './TagBox'; // Import TagBox component
import Slider from  '@mui/material/Slider';
import Box from '@mui/material/Box'

const SearchBar = ({ 
    cities, 
    onSelectTag, 
    selectedTags, 
    onRemoveTag, 
    toggleView, 
    isMapView,
    minRent,
    maxRent,
    onMinRentChange,
    onMaxRentChange, }) => {
        
    const [searchText, setSearchText] = useState('');
    const [showRentRange, setShowRentRange] = useState(false);
    const [rentValues, setRentValues] = useState([minRent, maxRent]);

    // Handle the form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        onSelectTag(searchText);
        setSearchText(''); // Clear search text after selecting
    };

    const handleRentRangeChange = (event, newValue) => {
        setRentValues(newValue);
        onMinRentChange(newValue[0]);
        onMaxRentChange(newValue[1]);
        console.log(`Min Rent: ${newValue[0]}, Max Rent: ${newValue[1]}`); // Logging the range values
      };

      const handleInputChange = (event) => {
        const { name, value } = event.target;
        let newValues = [...rentValues];
        if (name === 'minRent') {
          newValues[0] = Number(value);
          onMinRentChange(Number(value));
        } else if (name === 'maxRent') {
          newValues[1] = Number(value);
          onMaxRentChange(Number(value));
        }
        setRentValues(newValues);
      };

    return (
        <div className="search-bar">
            <div className="row  first-row">
                <div className="col search-input">
                    <form onSubmit={handleSubmit} className="w-100 d-flex">
                        <div className="input-group">
                            <Autocomplete cities={cities} onSelectTag={onSelectTag} setSearchText={setSearchText} />
                            <button className="btn btn-outline-primary" type="submit">
                                <i className="bi bi-search"></i> {/* Use the icon here */}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-auto price-btn">
                <button
                    className="btn btn-primary dropdown-toggle"
                    onClick={() => setShowRentRange(!showRentRange)}
                >
                    Price
                </button>
                    {showRentRange && (
                    
                    <Box>
                    <Slider
                      value={rentValues}
                      onChange={handleRentRangeChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={10000}
                    />
                    <input
                      type="number"
                      name="minRent"
                      value={rentValues[0]}
                      onChange={handleInputChange}
                    />
                    <input
                      type="number"
                      name="maxRent"
                      value={rentValues[1]}
                      onChange={handleInputChange}
                    />
                  </Box>
                    
                )}
                </div>
                <div className="col-auto bb-btn">
                    <button className="btn btn-primary dropdown-toggle" type="button">
                        Beds + Baths
                    </button>
                    {/* Dropdown Menu */}
                </div>
                <div className="col-auto md-btn">
                    <button className="btn btn-primary dropdown-toggle" type="button">
                        Move-In Date
                    </button>
                    {/* Dropdown Menu */}
                </div>
                <div className="col-auto">
                    <button className="btn btn-primary" type="button">
                        All Filters
                    </button>
                </div>
            </div>
            <div className="row mobile-options">
                <div className="col mobile-tag-box-container">
                    {/* Conditionally render TagBox only for mobile view */}
                    <TagBox tags={selectedTags} onRemoveTag={onRemoveTag} />
                </div>
                <div className="col-auto ms-auto">
                    <button className="btn btn-outline-primary" type="button" onClick={toggleView}>
                        {isMapView ? 'List' : 'Map'}
                    </button>
                </div>
                <div className="col-auto">
                    <button className="btn btn-outline-primary" type="button">
                        Sort
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;