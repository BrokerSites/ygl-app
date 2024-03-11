import React, { useState, useEffect, useRef } from 'react';

function Autocomplete({ cities, setSearchText, onSelectTag }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length > 0) {
      const safeValue = value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`^${safeValue}`, 'i');
      setSuggestions(cities.filter(city => regex.test(city)));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectItem = (item) => {
    setSearchText(item); // You might want to remove this if you don't need to keep the searchText state updated here
    onSelectTag(item);
    setInputValue('');
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault(); // Prevent the form from being submitted
      handleSelectItem(suggestions[0]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace' && suggestions.includes(inputValue)) {
      setInputValue('');
      setSuggestions([]);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setInputValue('');
        setSuggestions([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
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
            onKeyDown={handleKeyDown}
            onKeyPress={handleKeyPress}
            placeholder="Search city or neighborhood"
        />
        {suggestions.length > 0 && (
            <ul className="autocomplete-container">
                {suggestions.map((suggestion, index) => (
                    <li
                        key={index}
                        className="autocomplete-item"
                        onClick={() => handleSelectItem(suggestion)}
                    >
                        {suggestion}
                    </li>
                ))}
            </ul>
        )}
    </div>
  );
}

export default Autocomplete;
