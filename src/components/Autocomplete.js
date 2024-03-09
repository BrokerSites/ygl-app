import React, { useState, useEffect, useRef } from 'react';

function Autocomplete({ cities, setSearchText }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null); // Reference to the wrapper div

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      setSuggestions(cities.filter(city => regex.test(city)));
    } else {
      setSuggestions([]);
    }
  };

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setInputValue(''); // Clear input
        setSuggestions([]); // Close dropdown
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        type="text"
        className="form-control custom-rounded"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search city or neighborhood"
      />
      {suggestions.length > 0 && (
        <ul className="autocomplete-container">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="autocomplete-item" onClick={() => {
              setSearchText(suggestion);
              setInputValue(suggestion); // Set the input value to the selected suggestion
              setSuggestions([]); // Clear suggestions
            }}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Autocomplete;
