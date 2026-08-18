import { useNavigate } from 'react-router';
import { useProperties } from '../context/PropertiesContext';
import { PropertyCard } from '../components/PropertyCard';
import { Heart, Home } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Favorites() {
  const navigate = useNavigate();
  const { properties } = useProperties();
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favProps = properties.filter(prop => favorites.includes(prop.id));
    setFavoriteProperties(favProps);
  }, [properties]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-600 fill-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
          </div>
          <p className="text-gray-600">
            {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {/* Properties Grid */}
        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Saved Properties</h2>
            <p className="text-gray-600 mb-6">
              Start exploring and save properties you like
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Home className="w-5 h-5" />
              Browse Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
