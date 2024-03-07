import React, { useState } from 'react';


const SearchBar = () => {
    const [searchText, setSearchText] = useState('');

    // Handle the form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform search logic here
    };

    return (
        <div className="search-bar">
            <div className="row  first-row">
                <div className="col search-input">
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="City or Neighborhood"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                                <button className="btn btn-outline-primary" type="submit">
                                    <i className="bi bi-search"></i> {/* Use the icon here */}
                                </button>
                        </div>
                    </form>
                </div>
                <div className="col-auto price-btn">
                    <button className="btn btn-primary dropdown-toggle" type="button">
                        Price
                    </button>
                    {/* Dropdown Menu */}
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
                <div className="col-auto ms-auto">
                    <button className="btn btn-outline-primary" type="button">
                        Map
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
