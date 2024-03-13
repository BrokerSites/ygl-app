import React, { useState, useRef, useEffect } from 'react';
import Autocomplete from './Autocomplete';
import TagBox from './TagBox'; // Import TagBox component
import Slider from '@mui/material/Slider';
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
    onMaxRentChange,
}) => {

    const [searchText, setSearchText] = useState('');
    const [modalState, setModalState] = useState({
        showPriceInput: false,
        showBedBathInput: false
    });
    const [rentValues, setRentValues] = useState([minRent, maxRent]);
    const [bedsBaths, setBedsBaths] = useState({ beds: 1, baths: 1 });

    const priceButtonRef = useRef(null);
    const bedBathButtonRef = useRef(null);
    const modalRefs = useRef({});

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
        if (name === 'minRent' || name === 'maxRent') {
            const index = name === 'minRent' ? 0 : 1;
            const updatedRentValues = [...rentValues];
            updatedRentValues[index] = Number(value);
            setRentValues(updatedRentValues);
    
            if (name === 'minRent') onMinRentChange(Number(value));
            if (name === 'maxRent') onMaxRentChange(Number(value));
        } else if (name === 'beds' || name === 'baths') {
            setBedsBaths(prevValues => ({ ...prevValues, [name]: Number(value) }));
        }
    };

    const toggleModal = (modalName) => {
        setModalState(prevState => ({ ...prevState, [modalName]: !prevState[modalName] }));
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.entries(modalRefs.current).forEach(([key, ref]) => {
                if (ref && !ref.contains(event.target)) {
                    setModalState(prevState => ({ ...prevState, [key]: false }));
                }
            });
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
                        onClick={() => toggleModal('showPriceInput')}
                    >
                        Price
                    </button>
                    {modalState.showPriceInput && (
                        <Box ref={el => modalRefs.current['showPriceInput'] = el} className="input-overlay">
                            <Slider
                                value={rentValues}
                                onChange={handleRentRangeChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={10000}
                                step={100}
                            />
                            <div className='option-input-div'>
                                <input className='option-input' type="number" name="minRent" value={rentValues[0]} onChange={handleInputChange} />
                                <input className='option-input' type="number" name="maxRent" value={rentValues[1]} onChange={handleInputChange} />
                            </div>
                        </Box>
                    )}
                </div>
                <div className="col-auto bb-btn">
                    <button
                        ref={bedBathButtonRef}  // Attach the ref to the Beds + Baths button
                        className="btn btn-primary dropdown-toggle"
                        onClick={() => toggleModal('showBedBathInput')}
                    >
                        Beds + Baths
                    </button>
                    {modalState.showBedBathInput && (
                        <Box ref={el => modalRefs.current['showBedBathInput'] = el} className="input-overlay">
                            <div className="option-input-div">
                                <input className="option-input" type="number" name="beds" value={bedsBaths.beds} onChange={handleInputChange} placeholder="Beds" />
                                <input className="option-input" type="number" name="baths" value={bedsBaths.baths} onChange={handleInputChange} placeholder="Baths" />
                            </div>
                        </Box>
                    )}
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