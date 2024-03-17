import React from 'react';
import ListingCard from './ListingCard.js';
import TagBox from './TagBox'; // Import TagBox component
import ResultsBanner from './ResultsBanner'; // Import ResultsBanner component

const ListingsContainer = ({ listings, selectedTags, onRemoveTag, totalResults }) => {
  if (!Array.isArray(listings)) {
    console.error('Listings is not an array', listings);
    return null;
  }

  // Provide an empty array as default if selectedTags is undefined
  const tags = Array.isArray(selectedTags) ? selectedTags : [];

  return (
    <div className="listings-container">
      
      <div className="tag-box-container">
      <TagBox tags={tags} onRemoveTag={onRemoveTag} />
      <ResultsBanner count={listings.length} total={totalResults} />
      </div>
      
    <div className='card-container'>
    {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>

    </div>
  );
};

export default ListingsContainer;