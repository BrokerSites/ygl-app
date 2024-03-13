import React, { useState, useRef, useEffect } from 'react';
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
        const [showPriceInput, setShowPriceInput] = useState(false);
        const [rentValues, setRentValues] = useState([minRent, maxRent]);
        const priceButtonRef = useRef(null); // Create a ref for the price button
        const [priceInputPosition, setPriceInputPosition] = useState();
        const overlayRef = useRef(null);

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

      const handlePriceButtonClick = () => {
        if (!showPriceInput) {
            const buttonRect = priceButtonRef.current.getBoundingClientRect();
            setPriceInputPosition({
                top: buttonRect.bottom,
                left: buttonRect.left
            });
        }
        setShowPriceInput(!showPriceInput);
    };

    const toggleOverlay = () => setShowPriceInput(!showPriceInput);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                setShowPriceInput(false);
                // Add similar lines for other overlays
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                    ref={priceButtonRef} // Attach the ref to the button
                    className="btn btn-primary dropdown-toggle"
                    onClick={handlePriceButtonClick}
                >
                    Price
                </button>
                    {showPriceInput && (
                    <Box ref={overlayRef} className="price-input-overlay">
                    <Slider
                      value={rentValues}
                      onChange={handleRentRangeChange}
                      valueLabelDisplay="auto"
                      defaultValue={2000}
                      shiftStep={2000}
                      min={0}
                      max={10000}
                      step={100}
                    />
                    <div className='option-input-div'>

                    <input className='option-input'
                      type="number"
                      name="minRent"
                      value={rentValues[0]}
                      onChange={handleInputChange}
                    />
                    <input className='option-input'
                      type="number"
                      name="maxRent"
                      value={rentValues[1]}
                      onChange={handleInputChange}
                    />

                    </div>

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