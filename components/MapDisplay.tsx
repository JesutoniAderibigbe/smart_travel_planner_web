// FIX: Add global declaration for window.google to fix TypeScript error.
declare global {
  interface Window {
    google: any;
  }
}

import React, { useEffect, useRef } from 'react';
import type { Destination, BoundingBox } from '../types';

interface MapDisplayProps {
  destinations: Destination[];
  boundingBox: BoundingBox;
  onMarkerClick: (destination: Destination) => void;
  selectedDestination: Destination | null;
}

// A sleek, minimalist map style
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
];


const MapDisplay: React.FC<MapDisplayProps> = ({ destinations, boundingBox, onMarkerClick, selectedDestination }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  // FIX: Use `any` for Google Maps types to avoid namespace errors.
  const googleMap = useRef<any | null>(null);
  const markers = useRef<any[]>([]);
  const polyline = useRef<any | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) {
      return;
    }

    // Initialize map
    if (!googleMap.current) {
        googleMap.current = new window.google.maps.Map(mapRef.current, {
            center: { lat: 0, lng: 0 },
            zoom: 2,
            styles: mapStyle,
            disableDefaultUI: true,
            zoomControl: true,
        });
    }
    
    // Clear previous markers and polyline
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];
    polyline.current?.setMap(null);

    if (destinations.length > 0) {
        // Create new markers
        destinations.forEach(dest => {
            const marker = new window.google.maps.Marker({
                position: dest.location,
                map: googleMap.current,
                title: dest.name,
                animation: window.google.maps.Animation.DROP,
            });
            marker.addListener('click', () => onMarkerClick(dest));
            markers.current.push(marker);
        });

        // Create new polyline
        const path = destinations.map(d => d.location);
        polyline.current = new window.google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: '#00A3FF',
            strokeOpacity: 0.9,
            strokeWeight: 4,
            icons: [{
                icon: {
                    path: 'M 0,-1 0,1',
                    strokeOpacity: 1,
                    scale: 3
                },
                offset: '0',
                repeat: '20px'
            }],
        });
        polyline.current.setMap(googleMap.current);

        // Fit map to bounds
        const bounds = new window.google.maps.LatLngBounds();
        // Add a buffer to the bounds
        const northEast = new window.google.maps.LatLng(boundingBox.north, boundingBox.east);
        const southWest = new window.google.maps.LatLng(boundingBox.south, boundingBox.west);
        bounds.union(new window.google.maps.LatLngBounds(southWest, northEast));

        googleMap.current.fitBounds(bounds);
    }
  }, [destinations, boundingBox, onMarkerClick]);

  useEffect(() => {
      markers.current.forEach(marker => {
          const isSelected = marker.getTitle() === selectedDestination?.name;
          marker.setIcon(isSelected ? {
              // FIX: Use https for secure icon loading
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
          } : null); // null resets to default
          marker.setZIndex(isSelected ? 100 : 1);
      });
  }, [selectedDestination]);


  return (
    <div ref={mapRef} className="w-full h-96 lg:h-[70vh] bg-sky-100 rounded-lg shadow-lg overflow-hidden border-4 border-white">
      {/* Google Map will be rendered here */}
    </div>
  );
};

export default MapDisplay;