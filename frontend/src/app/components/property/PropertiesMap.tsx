import { useState, useMemo } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Property } from '../../types';
import { useNavigate } from 'react-router';

interface PropertiesMapProps {
  properties: Property[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629, // Center of India
};

export function PropertiesMap({ properties }: PropertiesMapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Calculate center based on properties
  const center = useMemo(() => {
    if (properties.length === 0) return defaultCenter;
    
    const firstWithCoords = properties.find(p => p.lat && p.lng);
    if (firstWithCoords) {
      return { lat: firstWithCoords.lat!, lng: firstWithCoords.lng! };
    }
    return defaultCenter;
  }, [properties]);

  if (loadError) return <div className="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl">Error loading maps. Please check your API key.</div>;
  if (!isLoaded) return <div className="p-4 text-gray-600 dark:text-gray-400 flex justify-center items-center h-full">Loading Maps...</div>;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={properties.length > 0 ? 10 : 5}
        center={center}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {properties.map((property) => (
          property.lat && property.lng && (
            <Marker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              onClick={() => setSelectedProperty(property)}
              animation={google.maps.Animation.DROP}
            />
          )
        ))}

        {selectedProperty && selectedProperty.lat && selectedProperty.lng && (
          <InfoWindow
            position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="p-2 max-w-xs cursor-pointer" onClick={() => navigate(`/property/${selectedProperty.id}`)}>
              <img 
                src={selectedProperty.image} 
                alt={selectedProperty.title} 
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <div className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold mb-1">
                {selectedProperty.status === 'for-sale' ? 'Buy' : 'Rent'}
              </div>
              <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{selectedProperty.title}</h3>
              <p className="font-bold text-blue-600 mt-1 text-sm">
                {selectedProperty.status === 'for-rent' ? `₹${selectedProperty.price.toLocaleString('en-IN')}/mo` : `₹${(selectedProperty.price / 100000).toFixed(2)} Lacs`}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{selectedProperty.location}, {selectedProperty.city}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
