import { useNavigate } from 'react-router';
import { PropertyCard } from '../components/PropertyCard';
import { Heart, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { favoritesApi, ApiProperty } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export function Favorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favoriteProperties, setFavoriteProperties] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavoriteProperties([]);
      return;
    }
    setLoading(true);
    favoritesApi.list()
      .then(data => setFavoriteProperties(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

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
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500">Loading your favorites...</p>
          </div>
        ) : !user ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Log in to view favorites</h2>
            <p className="text-gray-600 mb-6">
              You must be logged in to view and save favorite properties.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </button>
          </div>
        ) : favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property as any} />
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
