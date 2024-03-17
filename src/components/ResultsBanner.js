// ResultsBanner.js

import React from 'react';

const ResultsBanner = ({ count, total }) => {
  // You might want to implement pagination to handle the starting count
  const startCount = 1;
  const endCount = count < 100 ? count : 100;

  return (
    <div className="results-banner">
      <span>{`${startCount}-${endCount} of ${total} results`}</span>
      {/* Placeholder for the sort dropdown */}
      <div className="sort-dropdown">
        Sort :
        <select>
          <option value="recommended">Default</option>
          <option value="highToLow">High to Low</option>
          <option value="lowToHigh">Low to High</option>
        </select>
      </div>
    </div>
  );
};

export default ResultsBanner;
