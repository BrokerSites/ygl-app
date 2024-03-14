import React, { useState, useRef, useEffect } from 'react';
import PriceDropdown from './PriceDropdown';
import Autocomplete from './Autocomplete';
import TagBox from './TagBox';
import BedBathDropdown from './BedBathDropdown';
import MoveIn from './MoveIn';

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
        showMoveInInput: false, // New state for MoveIn
    });
    const [rentValues, setRentValues] = useState([minRent, maxRent]);
    const [bedsBaths, setBedsBaths] = useState({ beds: [0, 5], baths: [1, 5] });
    const priceButtonRef = useRef(null); // Ref for price button
    const bedBathButtonRef = useRef(null);
    const moveInButtonRef = useRef(null); // Add ref for Move-In button

    const modalRefs = useRef([]);
    const setModalRef = (element) => {
        // Make sure we are storing the element correctly and not overwriting with non-DOM values
        if (element) {
            modalRefs.current = [element]; // Should only hold one element for the current modal, adjust if managing multiple modals
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSelectTag(searchText);
        setSearchText('');
    };


    const formatBeds = (value) => {
      if (value === '') return '';
      return value === 0 ? 'Studio' : value >= 5 ? '5+' : value.toString();
  };

  const formatBaths = (value) => {
      if (value === '') return '';
      return value >= 5 ? '5+' : value.toString();
  };


  const toggleModal = (modalName) => {
    setModalState(prevState => ({
        ...prevState,
        [modalName]: !prevState[modalName],
    }));
};



useEffect(() => {
    const handleClickOutside = (event) => {
        if (modalRefs.current.length && modalRefs.current[0] && !modalRefs.current[0].contains(event.target)) {
            if (modalState.showPriceInput && !priceButtonRef.current.contains(event.target)) {
                setModalState(prevState => ({ ...prevState, showPriceInput: false }));
            }
            if (modalState.showBedBathInput && !bedBathButtonRef.current.contains(event.target)) {
                setModalState(prevState => ({ ...prevState, showBedBathInput: false }));
            }
            if (modalState.showMoveInInput && !moveInButtonRef.current.contains(event.target)) {
                setModalState(prevState => ({ ...prevState, showMoveInInput: false }));
            }
        }
    };

    // We add the event listener if any modal is open
    if (modalState.showPriceInput || modalState.showBedBathInput || modalState.showMoveInInput) {
        document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener when the component is unmounted or if all modals are closed
    return () => {
        if (!modalState.showPriceInput && !modalState.showBedBathInput && !modalState.showMoveInInput) {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    };
}, [modalState, priceButtonRef, bedBathButtonRef, moveInButtonRef]);


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
          <button
              ref={priceButtonRef} // Attach ref to button
              className="btn btn-primary dropdown-toggle p-btn"
              onClick={() => toggleModal('showPriceInput')}
          >
              Price
          </button>
          <PriceDropdown
              setRef={setModalRef} // new prop to pass the ref setting function
              buttonRef={priceButtonRef} // Pass ref to PriceDropdown
              minRent={rentValues[0]}
              maxRent={rentValues[1]}
              onRentChange={(newValue) => {
                  setRentValues(newValue);
                  onMinRentChange(newValue[0]);
                  onMaxRentChange(newValue[1]);
              }}
              isOpen={modalState.showPriceInput}
          />
          <button
          ref={bedBathButtonRef}
          className="btn btn-primary dropdown-toggle bb-btn"
          onClick={() => toggleModal('showBedBathInput')}
          >
          Beds + Baths
          </button>
          {modalState.showBedBathInput && (
          <BedBathDropdown
              setRef={setModalRef} // new prop to pass the ref setting function
              buttonRef={bedBathButtonRef} // Pass ref to BedBathDropdown
              bedsBaths={bedsBaths}
              onBedsBathsChange={setBedsBaths}
              isOpen={modalState.showBedBathInput}
              onToggle={() => toggleModal('showBedBathInput')}
              formatBeds={formatBeds}
              formatBaths={formatBaths}
          />
          )}
            <button
                ref={moveInButtonRef} // Attach ref to Move-In button
                className="btn btn-primary dropdown-toggle mi-btn"
                onClick={() => toggleModal('showMoveInInput')}
            >
                Move-In
            </button>
            {modalState.showMoveInInput && (
            <MoveIn
                setRef={setModalRef} // new prop to pass the ref setting function
                buttonRef={moveInButtonRef} // Pass ref to MoveIn
                isOpen={modalState.showMoveInInput}
                onToggle={() => toggleModal('showMoveInInput')}
            />
            )}
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