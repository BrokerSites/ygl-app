import React from 'react';
import ListingCard from './ListingCard.js';
import TagBox from './TagBox'; // Import TagBox component
import ResultsBanner from './ResultsBanner'; // Import ResultsBanner component
import PaginationComponent from './PaginationComponent.js';

const ListingsContainer = ({ listings, selectedTags, onRemoveTag, totalResults, currentPage, onPageChange, onSortChange }) => {
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
      <ResultsBanner 
      count={listings.length} 
      total={totalResults} 
      onSortChange={onSortChange}
      />
      </div>
      
    <div className='card-container'>
    {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>

    <PaginationComponent 
          
          totalResults={totalResults}
          itemsPerPage={100}
          page={currentPage}
          onPageChange={onPageChange}
        />

    </div>
  );
};

export default ListingsContainer;