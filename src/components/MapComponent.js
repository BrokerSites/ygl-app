import React from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet.markercluster';


const MapComponent = ({ listings }) => {
    const position = [42.328591, -71.388615]; // Default position, you can set it to be the center of your listings or a specific location
  
    return (
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {listings.map(listing => {
          // Create a custom icon for each marker
          const icon = L.divIcon({
            className: 'custom-icon',
            html: `<div>
                     $${listing.price}
                   </div>`
          });
  
          return (
            <Marker
              key={listing.id}
              position={[listing.latitude, listing.longitude]}
              icon={icon}
            />
          );
        })}
      </MapContainer>
    );
  };
  
  export default MapComponent;
