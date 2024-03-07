import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListingsContainer from './components/ListingsContainer';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import listingsData from './sample.json';

const App = () => {
    const [isMobileMapView, setIsMobileMapView] = useState(false); // State to toggle between map and list in mobile view

    const toggleMobileView = () => setIsMobileMapView(!isMobileMapView);

    return (
        <>
            <div className='search-container'>
                <SearchBar toggleView={toggleMobileView} isMapView={isMobileMapView} />
            </div>
            <div className="desktop-view">
              <div className='listings-and-map'>
              <ListingsContainer />
                <div className='map-container'>
                    <MapComponent listings={listingsData.listings} />
                </div>
              </div>
            </div>
            <div className="mobile-view">
                {isMobileMapView ? (
                    <MapComponent listings={listingsData.listings} />
                ) : (
                    <ListingsContainer />
                )}
            </div>
        </>
    );
};

export default App;
