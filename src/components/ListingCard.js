import React from 'react';

const ListingCard = ({ listing }) => {
  const { streetName, city, beds, baths, price, photos } = listing;

  return (
    <div className="card">
      <img src={photos[0]} className="card-img-top" alt="Listing" />
      <div className="card-body">
        <h5 className="card-title">${price}</h5>
        <p className="card-text">{`${beds} bed, ${baths} bath`}</p>
        <p className="card-text">{`${streetName}, ${city}`}</p>
      </div>
    </div>
  );
};

export default ListingCard;