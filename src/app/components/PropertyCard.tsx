import { Property } from '../types';
import { Heart, Bed, Bath, Maximize, Share2 } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if property is in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(property.id));
  }, [property.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const updated = favorites.filter((id: string) => id !== property.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      // Add to favorites
      favorites.push(property.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}/property/${property.id}`;
    const shareData = {
      title: property.title,
      text: `Check out this property: ${property.title}`,
      url: shareUrl,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log('Shared successfully');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        // Show a better notification
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        notification.textContent = 'Link copied to clipboard!';
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    } catch (err: any) {
      // If clipboard fails, provide a manual copy option
      if (err.name !== 'AbortError') {
        console.log('Error sharing:', err);
        prompt('Copy this link:', shareUrl);
      }
    }
  };

  const formatPrice = (price: number, status: string) => {
    if (status === 'for-rent') {
      return `₹${price.toLocaleString('en-IN')}/month`;
    }
    return `₹${(price / 100000).toFixed(2)} Lacs`;
  };

  return (
    <Link to={`/property/${property.id}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button 
              className={`p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition ${
                isFavorite ? 'bg-red-50' : ''
              }`}
              onClick={handleFavoriteClick}
            >
              <Heart 
                className={`w-5 h-5 ${isFavorite ? 'text-red-600 fill-red-600' : 'text-gray-600'}`}
              />
            </button>
            <button 
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
              onClick={handleShareClick}
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
            {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">
              {property.title}
            </h3>
            <p className="text-sm text-gray-600">{property.location}, {property.city}</p>
          </div>

          <div className="text-2xl font-bold text-blue-600 mb-3">
            {formatPrice(property.price, property.status)}
          </div>

          {/* RERA Number for apartments, villas, and commercial */}
          {property.reraNumber && (property.type === 'apartment' || property.type === 'villa' || property.type === 'commercial') && (
            <div className="text-xs text-gray-500 mb-3">
              RERA: {property.reraNumber}
            </div>
          )}

          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4" />
              <span>{property.area} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}