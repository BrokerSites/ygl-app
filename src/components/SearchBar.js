import React, { useState, useRef, useEffect } from 'react';
import Autocomplete from './Autocomplete';
import TagBox from './TagBox';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

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
        showBedBathInput: false,
    });
    const [rentValues, setRentValues] = useState([minRent, maxRent]);
    const [bedsBaths, setBedsBaths] = useState({ beds: [0, 5], baths: [1, 5] });

    const priceButtonRef = useRef(null);
    const bedBathButtonRef = useRef(null);
    const modalRefs = useRef({});

    const handleSubmit = (event) => {
        event.preventDefault();
        onSelectTag(searchText);
        setSearchText('');
    };

    const handleRentRangeChange = (event, newValue) => {
        setRentValues(newValue);
        onMinRentChange(newValue[0]);
        onMaxRentChange(newValue[1]);
    };

    const formatValue = (value, name) => {
        if (name === 'beds') {
            return value === 0 ? 'Studio' : value === 5 ? '5+' : value;
        } else if (name === 'baths') {
            return value === 5 ? '5+' : value;
        }
        return value;
    };

    const parseValue = (value, name) => {
      if (value === '') {
          return value;  // Return the empty string without conversion
      }
      if (name === 'beds') {
          return value === 'Studio' ? 0 : value === '5+' ? 5 : parseInt(value, 10);
      } else if (name === 'baths') {
          return value === '5+' ? 5 : parseInt(value, 10);
      }
      return parseInt(value, 10);
  };

    const formatBeds = (value) => {
      if (value === '') return '';
      return value === 0 ? 'Studio' : value >= 5 ? '5+' : value.toString();
  };

  const formatBaths = (value) => {
      if (value === '') return '';
      return value >= 5 ? '5+' : value.toString();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === 'minRent' || name === 'maxRent') {
        const index = name === 'minRent' ? 0 : 1;
        const updatedRentValues = [...rentValues];
        updatedRentValues[index] = value === '' ? '' : Number(value);
        setRentValues(updatedRentValues);
 
        if (name === 'minRent') onMinRentChange(value === '' ? '' : Number(value));
        if (name === 'maxRent') onMaxRentChange(value === '' ? '' : Number(value));
    } else if (name.startsWith('beds') || name.startsWith('baths')) {
        const [key, bound] = name.split('-');
        const index = bound === 'min' ? 0 : 1;
        const newValue = parseValue(value, key);
 
        setBedsBaths((prevValues) => ({
            ...prevValues,
            [key]: [
                index === 0 ? newValue : prevValues[key][0],
                index === 1 ? newValue : prevValues[key][1],
            ],
        }));
    }
};

    const handleBedsChange = (event, newValue) => {
        setBedsBaths(prevValues => ({
            ...prevValues,
            beds: newValue,
        }));
    };
      
    const handleBathsChange = (event, newValue) => {
        setBedsBaths(prevValues => ({
            ...prevValues,
            baths: newValue,
        }));
    };

    const toggleModal = (modalName) => {
        setModalState(prevState => ({
            ...prevState,
            [modalName]: !prevState[modalName],
        }));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.entries(modalRefs.current).forEach(([key, ref]) => {
                if (ref && !ref.contains(event.target)) {
                    setModalState(prevState => ({
                        ...prevState,
                        [key]: false,
                    }));
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
        <Box ref={(el) => (modalRefs.current['showBedBathInput'] = el)} className="input-overlay">
                {/* BEDS slider and inputs */}
                <div className="slider-container">
                  <div className="slider-label">BEDS</div>
                  <Slider
                    value={bedsBaths.beds}
                    onChange={handleBedsChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                    step={1}
                    valueLabelFormat={formatBeds}  // Use the custom label formatting function
                    marks={[
                      { value: 0, label: 'Studio' },
                      { value: 5, label: '5+' },
                    ]}
                  />
                  <div className="input-container">
                  <input
                    className="option-input"
                    type="text"
                    name="beds-min"
                    value={formatBeds(bedsBaths.beds[0])}
                    onChange={handleInputChange}
                    onClick={(e) => e.target.select()}
                    
                  />
                  <input
                    className="option-input"
                    type="text"
                    name="beds-max"
                    value={formatBeds(bedsBaths.beds[1])}
                    onChange={handleInputChange}
                    onClick={(e) => e.target.select()}
                  />
                  </div>
                </div>
                {/* BATHS slider and inputs */}
                <div className="slider-container">
                  <div className="slider-label">BATHS</div>
                  <Slider
                    value={bedsBaths.baths}
                    onChange={handleBathsChange}
                    valueLabelDisplay="auto"
                    min={1}
                    max={5}
                    step={1}
                    marks={[
                      { value: 5, label: '5+' },
                    ]}
                  />
                  <div className="input-container">
                    <input
                      className="option-input"
                      type="text"
                      name="baths-min"
                      value={formatBaths(bedsBaths.baths[0])}
                      onChange={handleInputChange}
                      onClick={(e) => e.target.select()}
                    />
                    <input
                      className="option-input"
                      type="text"
                      name="baths-max"
                      value={formatBaths(bedsBaths.baths[1])}
                      onChange={handleInputChange}
                      onClick={(e) => e.target.select()}
                    />
                  </div>
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