import React from 'react';
import ListingCard from './ListingCard.js';
import listingsData from '../sample.json'; // Adjust the path if your sample.json is located elsewhere

const ListingsContainer = ({ listings }) => {
  // Ensure that listings is an array before trying to map over it
  if (!Array.isArray(listings)) {
    console.error('Listings is not an array', listings);
    return null; // or some error component
  }

  return (
    <div className="listings-container">
      {listings.map(listing => (
        // make sure ListingCard can handle all the properties inside a listing
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingsContainer;
