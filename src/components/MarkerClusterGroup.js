import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';


const MarkerClusterGroup = ({ listings }) => {
    const map = useMap();
  
    useEffect(() => {
      if (!map) return;
  
      const markerClusterGroup = L.markerClusterGroup();
  
      listings.forEach((listing) => {
        const { latitude, longitude, price, beds, baths, photos, city } = listing;
      
        // Use a default image if there's no photo available
        const imageUrl = photos && photos.length > 0 ? photos[0] : 'https://ygl-search.s3.us-east-2.amazonaws.com/imgs/no-img.webp';
      
        // Determine the correct pluralization for beds and baths
        const bedText = beds === 1 ? '1 bed' : `${beds} beds`;
        const bathText = baths === 1 ? '1 bath' : `${baths} baths`;
      
        const popupContent = `
        <div class="popup-content" style="text-align: center; width:17em;">
          <div style="width: 100%; height: 0; padding-top: 75%; position: relative;">
            <img src="${imageUrl}" alt="Listing" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div class="details" style="margin-top: 10px;">
            <h4>$${price}</h4>
            <div class="bbcity">
            <p>${bedText}, ${bathText}</p>
            <p>${city}</p> 
            <div>
          </div>
        </div>
      `;
      
        const marker = L.marker([latitude, longitude], {
          icon: L.divIcon({
            html: `<div class="custom-icon">$${price}</div>`,
            className: 'marker-icon',
          })
        });
      
        marker.bindPopup(popupContent, {
          maxWidth: "auto",
          className: 'custom-popup',
        });
      
        markerClusterGroup.addLayer(marker);
      });
  
      map.addLayer(markerClusterGroup);
  
      return () => {
        map.removeLayer(markerClusterGroup);
      };
    }, [map, listings]);
  
    return null;
  };

export default MarkerClusterGroup;
