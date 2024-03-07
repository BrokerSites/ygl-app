import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

// Define a component to handle marker clustering
const MarkerClusterGroup = ({ listings }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const markerClusterGroup = L.markerClusterGroup({
        spiderfyDistanceMultiplier: 2 // Adjust spiderfy distance
      });

    listings.forEach((listing) => {
      const marker = L.marker([listing.latitude, listing.longitude], {
        icon: L.divIcon({
          html: `<div class="custom-icon">$${listing.price}</div>`,
          className: 'marker-icon',
        })
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

const MapComponent = ({ listings }) => {
  const position = [42.328591, -71.388615];

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup listings={listings} />
    </MapContainer>
  );
};

export default MapComponent;
