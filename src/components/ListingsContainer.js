import React from 'react';
import ListingCard from './ListingCard.js';
import listingsData from '../sample.json'; // Adjust the path if your sample.json is located elsewhere

const ListingsContainer = () => {
  return (
    <div className="listings-container">
      {listingsData.listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default ListingsContainer;
