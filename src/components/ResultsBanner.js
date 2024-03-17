import React from 'react';

const ResultsBanner = ({ count, total, onSortChange, sortParams = { sort_name: null, sort_dir: null } }) => {
  const startCount = 1;
  const endCount = count < 100 ? count : 100;

  // Use `sortParams` with a fallback in case it's undefined
  let selectedSortValue = 'default';
  if (sortParams && sortParams.sort_name === 'rent' && sortParams.sort_dir === 'desc') {
    selectedSortValue = 'highToLow';
  } else if (sortParams && sortParams.sort_name === 'rent' && sortParams.sort_dir === 'asc') {
    selectedSortValue = 'lowToHigh';
  }

  return (
    <div className="results-banner">
      <span>{`${startCount}-${endCount} of ${total} results`}</span>
      <div className="sort-dropdown">
        Sort :
        <select onChange={onSortChange} value={selectedSortValue}>
          <option value="default">Default</option>
          <option value="highToLow">High to Low</option>
          <option value="lowToHigh">Low to High</option>
        </select>
      </div>
    </div>
  );
};

export default ResultsBanner;
