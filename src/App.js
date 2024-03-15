import React, { useState, useEffect, useRef } from 'react';
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
    const [selectedTags, setSelectedTags] = useState([]);
    const [cityNeighborhood, setCityNeighborhood] = useState('');
    const [minRent, setMinRent] = useState(0); // Default minimum rent
    const [maxRent, setMaxRent] = useState(10000); // Default maximum rent
    const [moveInOption, setMoveInOption] = useState('Anytime');
    const [selectedDate, setSelectedDate] = useState('');
    const [bedsBaths, setBedsBaths] = useState({ beds: [0, 5], baths: [1, 5] });
    const overlayRef = useRef(null);

    const closeOverlays = () => {
        // Logic to close autocomplete and price input overlays
    };

    const handleSelectTag = (tag) => {
        // Check if the tag is in the cities list or matches the pattern "Neighborhood (City)"
        const isValidTag = cities.includes(tag) || /\(.+\)/.test(tag);
        if (isValidTag && !selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
    };


    const handleRemoveTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };

    useEffect(() => {
        const fetchCitiesAndNeighborhoods = async () => {
            try {
                const response = await axios.post('http://ec2-3-142-154-120.us-east-2.compute.amazonaws.com:3000/api/accounts');
                const xmlData = response.data;

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlData, "text/xml");

                let cityList = [];
                let neighborhoodList = [];

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

                const combinedList = [...new Set([...cityList, ...neighborhoodList])];
                setCities(combinedList);
            } catch (error) {
                console.error('Error fetching XML data:', error);
            }
        };

        fetchCitiesAndNeighborhoods();
    }, []);

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const response = await axios.post('http://ec2-3-142-154-120.us-east-2.compute.amazonaws.com:3000/api/rentals');
                if (response.data && response.data.listings) {
                    setListings(response.data.listings);
                } else {
                    throw new Error('Listings data is not available in the response');
                }
            } catch (error) {
                console.error('Error fetching rental listings:', error);
                setListings([]);
            }
        };

        fetchRentals();
    }, []);

    useEffect(() => {
        const formatted = selectedTags.map(tag => {
            if (tag.includes('(')) {
                const parts = tag.match(/(.*)\s\((.*)\)/);
                return `${parts[2]}:${parts[1]}`;
            }
            return tag;
        }).join(',');
        setCityNeighborhood(formatted);
    }, [selectedTags]);




    //Organize the variables we will send to the API here, then put them under a greater variable. 
    //Any time one of the minor variables change, the greater is updated and a new call is made

    useEffect(() => {
        console.log("city_neighborhood:", cityNeighborhood);
    }, [cityNeighborhood]); // This useEffect will run every time `cityNeighborhood` changes.




    const toggleMobileView = () => setIsMobileMapView(!isMobileMapView);

    return (
        <>
            <div className='search-container'>
                <SearchBar
                    cities={cities}
                    onSelectTag={handleSelectTag}
                    selectedTags={selectedTags}
                    onRemoveTag={handleRemoveTag}
                    toggleView={toggleMobileView}
                    isMapView={isMobileMapView}
                    minRent={minRent}
                    maxRent={maxRent}
                    onMinRentChange={setMinRent}
                    onMaxRentChange={setMaxRent}
                    bedsBaths={bedsBaths}
                    setBedsBaths={setBedsBaths}
                    moveInOption= {moveInOption}
                    setMoveInOption={setMoveInOption}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            </div>
            <div className="desktop-view">
                <div className='listings-and-map'>
                    <ListingsContainer
                        listings={listings}
                        selectedTags={selectedTags}
                        onRemoveTag={handleRemoveTag}
                    />
                    <div className='map-container'>
                        <MapComponent listings={listings} />
                    </div>
                </div>

            </div>
            <div className="mobile-view">
                {isMobileMapView ? (
                    <MapComponent listings={listings} />
                ) : (
                    <ListingsContainer
                        listings={listings}
                        selectedTags={selectedTags}
                        onRemoveTag={handleRemoveTag}
                    />
                )}
            </div>
        </>
    );
};

export default App;