import { Property } from '../../types';
import { Heart, Bed, Bath, Maximize, Share2 } from 'lucide-react';
import { Link } from 'react-router';
import { useFavorites } from '../../context/FavoritesContext';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await toggleFavorite(property.id);
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
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in text-sm font-medium';
        notification.textContent = 'Link copied to clipboard!';
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
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
    <Link to={`/property/${property.id}`} className="group block">
      <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <button 
              className={`p-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 transition ${
                favorite ? 'text-red-600' : 'text-gray-600 dark:text-gray-300'
              }`}
              onClick={handleFavoriteClick}
            >
              <Heart 
                className={`w-4 h-4 ${favorite ? 'text-red-600 fill-red-600' : ''}`}
              />
            </button>
            <button 
              className="p-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
              onClick={handleShareClick}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full shadow-sm">
            {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {property.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{property.location}, {property.city}</p>
          </div>

          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 my-3">
            {formatPrice(property.price, property.status)}
          </div>

          {/* RERA Number for apartments, villas, and commercial */}
          {property.reraNumber && (property.type === 'apartment' || property.type === 'villa' || property.type === 'commercial') && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-mono">
              RERA: {property.reraNumber}
            </div>
          )}

          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span>{property.area} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
