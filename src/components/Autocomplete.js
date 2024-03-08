import React, { useState } from 'react';

function Autocomplete({ cities }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

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

  return (
    <>
      <input
        type="text"
        className="form-control" // Ensures the input field has Bootstrap styling
        value={inputValue}
        onChange={handleChange}
        placeholder="Search city or neighborhood"
      />
      {suggestions.length > 0 && (
        <ul className="autocomplete-container">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="autocomplete-item">
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default Autocomplete;