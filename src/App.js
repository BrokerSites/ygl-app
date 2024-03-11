import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListingsContainer from './components/ListingsContainer';
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';

import axios from 'axios';

const App = () => {
    const [isMobileMapView, setIsMobileMapView] = useState(false);
    const [cities, setCities] = useState([]);
    const [listings, setListings] = useState([]);


    useEffect(() => {
        const fetchCitiesAndNeighborhoods = async () => {
          try {
            const response = await axios.post('http://ec2-3-142-154-120.us-east-2.compute.amazonaws.com:3000/api/accounts');
            const xmlData = response.data;
      
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlData, "text/xml");
      
            let cityList = []; // Store city names
            let neighborhoodList = []; // Store "Neighborhood (City)" strings
      
            const accounts = xmlDoc.getElementsByTagName('Account');
            Array.from(accounts).forEach(account => {
              const cities = account.getElementsByTagName('City');
              Array.from(cities).forEach(cityElement => {
                const nameElements = cityElement.getElementsByTagName('Name');
                if (nameElements.length > 0) {
                  const cityName = nameElements[0].textContent.trim();
                  cityList.push(cityName);
                  const neighborhoods = cityElement.getElementsByTagName('Neighborhood');
      
                  Array.from(neighborhoods).forEach(neighborhoodElement => {
                    const neighborhoodName = neighborhoodElement.textContent.trim();
                    neighborhoodList.push(`${neighborhoodName} (${cityName})`);
                  });
                }
              });
            });
      
            // Combine the lists, ensuring unique values only.
            const combinedList = [...new Set([...cityList, ...neighborhoodList])];
            setCities(combinedList); // Update state with the combined list
            console.log("Cities and Neighborhoods:", combinedList);
      
          } catch (error) {
            console.error('Error fetching XML data:', error);
          }
        };
        fetchCitiesAndNeighborhoods();
      }, []);

      useEffect(() => {
        const fetchRentals = async () => {
          try {
            const response = await axios.post('http://ec2-3-142-154-120.us-east-2.compute.amazonaws.com:3000/api/rentals', { /* body if needed */ });
            if (response.data && response.data.listings) {
              setListings(response.data.listings); // Assure that we are setting an array
              console.log("Rental listings:", response.data.listings);
            } else {
              throw new Error('Listings data is not available in the response');
            }
          } catch (error) {
            console.error('Error fetching rental listings:', error);
            setListings([]); // Setting to an empty array in case of error or if data is not available
          }
        };
      
        fetchRentals();
      }, []);
      

    const toggleMobileView = () => setIsMobileMapView(!isMobileMapView);

    return (
        <>
            <div className='search-container'>
                {/* Here we pass the cities array to the SearchBar or Autocomplete component */}
                <SearchBar cities={cities} toggleView={toggleMobileView} isMapView={isMobileMapView} />
            </div>
            <div className="desktop-view">
                <div className='listings-and-map'>
                    <ListingsContainer listings={listings} />
                    <div className='map-container'>
                    <MapComponent listings={listings} />
                    </div>
                </div>
            </div>
            <div className="mobile-view">
                {isMobileMapView ? (
                    <MapComponent listings={listings} />
                ) : (
                  <ListingsContainer listings={listings} />
                )}
            </div>
        </>
    );
};


export default App;