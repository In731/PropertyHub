import { Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NotFoundError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors">
      <div className="max-w-lg w-full">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8 text-center">
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="relative w-24 h-24 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl flex items-center justify-center">
              <Home className="w-12 h-12 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
            </div>
          </div>

          {/* 404 */}
          <div className="text-5xl font-extrabold text-gray-300 dark:text-gray-700 mb-2">404</div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Property Not Found
          </h1>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            We couldn't find the property you're looking for. It may have been sold, 
            removed from our listings, or the link might be incorrect.
          </p>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={() => navigate('/properties')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-600/20"
            >
              <Home className="w-4 h-4" />
              Browse All Properties
            </button>

            <button
              onClick={() => navigate('/properties')}
              className="w-full px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:border-blue-600 transition font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              Search Properties
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 transition text-xs"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">Popular Searches:</span>
            {' '}
            <button 
              onClick={() => navigate('/properties')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Mumbai Properties
            </button>
            {', '}
            <button 
              onClick={() => navigate('/properties?propertyType=villa')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Luxury Villas
            </button>
            {', '}
            <button 
              onClick={() => navigate('/properties?propertyType=apartment')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Apartments
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
