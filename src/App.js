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
    const [hasPhotos, setHasPhotos] = useState(false);
    const [isPetFriendly, setIsPetFriendly] = useState(false);
    const [hasParking, setHasParking] = useState(false);

    const [modalState, setModalState] = useState({
        showPriceInput: false,
        showBedBathInput: false,
        showMoveInInput: false, // New state for MoveIn
        showAllFiltersInput: false, // New state for MoveIn
    });


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


    const prevModalStateRef = useRef(modalState);
    const prevSelectedTagsRef = useRef(selectedTags);
    const upperLimitForBaths = 20; // Max limit for baths
    const previousValuesRef = useRef({ cityNeighborhood, bedsBaths, minRent, maxRent, moveInOption, selectedDate });

    const prepareBedsBathsValues = (bedsBaths) => {
        let minBed = bedsBaths.beds[0];
        let maxBed = bedsBaths.beds[1];
        let bathsRange = [];

        // Handle beds
        if (maxBed === '5+' || maxBed === 5) {
            maxBed = undefined; // No upper limit for beds
        }

        // Handle baths
        let minBath = parseInt(bedsBaths.baths[0]);
        let maxBath = parseInt(bedsBaths.baths[1] === '5+' ? upperLimitForBaths : bedsBaths.baths[1]);

        if (maxBath === 5) {
            maxBath = upperLimitForBaths; // Extend to the upper limit
        }

        for (let i = minBath; i <= maxBath; i++) {
            bathsRange.push(i);
        }

        return { minBed, maxBed, bathsRange };
    };

    const formatDateForApi = (moveInOption, selectedDate) => {
        let availFrom, availTo;

        // Function to format date from YYYY-MM-DD to MM/DD/YY
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
        };

        switch (moveInOption) {
            case 'Anytime':
                availFrom = undefined;
                availTo = undefined;
                break;
            case 'Now':
                availTo = formatDate(new Date()); // Use current date for 'Now'
                break;
            case 'Before':
                availTo = formatDate(selectedDate); // Use the selected date for 'Before'
                break;
            case 'After':
                availFrom = formatDate(selectedDate); // Use the selected date for 'After'
                break;
        }

        return { availFrom, availTo };
    };

    useEffect(() => {
        // Format city_neighborhood based on selectedTags immediately when they change
        const formattedCityNeighborhood = selectedTags.map(tag => {
            if (tag.includes('(')) {
                const parts = tag.match(/(.*)\s\((.*)\)/);
                return `${parts[2]}:${parts[1]}`;
            }
            return tag;
        }).join(',');
        setCityNeighborhood(formattedCityNeighborhood);
    }, [selectedTags]); // This ensures cityNeighborhood is updated as soon as selectedTags change

    useEffect(() => {

        const modalJustClosed = Object.entries(modalState).some(([key, value]) => !value && prevModalStateRef.current[key]);
        const tagsChanged = selectedTags.length !== prevSelectedTagsRef.current.length;


        const currentValues = {
            cityNeighborhood: selectedTags.map(tag => tag.includes('(') ? tag.match(/(.*)\s\((.*)\)/).slice(2).join(':') : tag).join(','),
            bedsBaths: prepareBedsBathsValues(bedsBaths),
            minRent,
            maxRent,
            moveInOption,
            selectedDate,
            hasPhotos,
            isPetFriendly,
            hasParking
        };

        const valuesChanged = Object.keys(currentValues).some(key =>
            JSON.stringify(currentValues[key]) !== JSON.stringify(previousValuesRef.current[key])
        );

        if ((modalJustClosed || tagsChanged) && valuesChanged) {

            const { minBed, maxBed, bathsRange } = prepareBedsBathsValues(bedsBaths);
            const baths = bathsRange.join(','); // Store the joined baths range in a variable
            const { availFrom, availTo } = formatDateForApi(moveInOption, selectedDate);

            const formattedCityNeighborhood = selectedTags.map(tag => {
                if (tag.includes('(')) {
                    const parts = tag.match(/(.*)\s\((.*)\)/);
                    return `${parts[2]}:${parts[1]}`;
                }
                return tag;
            }).join(',');


            console.log("City Neighborhood:", formattedCityNeighborhood);
            console.log("Min Bed:", minBed);
            console.log("Max Bed:", maxBed);
            console.log("Baths:", baths);
            console.log("Min Price:", minRent);
            console.log("Max Price:", maxRent);
            console.log("Move-In Option:", moveInOption);
            console.log("Available From:", availFrom);
            console.log("Available To:", availTo);
            console.log("Selected Date:", selectedDate);
            // Here you would trigger the API request with these parameters

            const apiParams = {
                page_count: 100,
                city_neighborhood: formattedCityNeighborhood,
                min_bed: minBed,
                max_bed: maxBed !== undefined ? maxBed : undefined,
                baths: baths,
                min_rent: minRent,
                max_rent: maxRent >= 10000 ? undefined : maxRent,
                avail_from: ['Anytime', 'Before', 'Now'].includes(moveInOption) ? undefined : availFrom,
                avail_to: ['Anytime', 'After'].includes(moveInOption) ? undefined : availTo,
                photo: hasPhotos ? 'Y' : undefined,
                pet: isPetFriendly ? 'friendly' : undefined,
                parking: hasParking ? 'Y' : undefined
            };

            Object.keys(apiParams).forEach(key => apiParams[key] === undefined && delete apiParams[key]);

            (async () => {
                try {
                    const response = await axios.post('http://ec2-3-142-154-120.us-east-2.compute.amazonaws.com:3000/api/rentals', apiParams);
                    console.log("Response from API:", response.data); // Log the entire response data from the API
                    setListings(response.data.listings || []);
                } catch (error) {
                    console.error('Error fetching listings:', error);
                    setListings([]); // Reset the listings on error
                }
            })(); // Immediately invoked async function to handle the API call

            console.log("API Parameters:", apiParams);

            previousValuesRef.current = currentValues;
        }

        // Update the refs for the next render
        prevModalStateRef.current = modalState;
        prevSelectedTagsRef.current = selectedTags.slice();
    }, [modalState, selectedTags, bedsBaths, minRent, maxRent, moveInOption, selectedDate]);





    const toggleMobileView = () => setIsMobileMapView(!isMobileMapView);

    return (
        <>
            <div className='search-container'>
                <SearchBar
                    modalState={modalState}
                    setModalState={setModalState}
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
                    moveInOption={moveInOption}
                    setMoveInOption={setMoveInOption}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    hasPhotos={hasPhotos}
                    setHasPhotos={setHasPhotos}
                    isPetFriendly={isPetFriendly}
                    setIsPetFriendly={setIsPetFriendly}
                    hasParking={hasParking}
                    setHasParking={setHasParking}
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