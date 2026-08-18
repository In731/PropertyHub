import { Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NotFoundError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Animated Icon */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
            <div className="relative w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
              <Home className="w-16 h-16 text-blue-600" strokeWidth={1.5} />
              <div className="absolute top-0 right-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center border-4 border-white">
                <span className="text-2xl">❌</span>
              </div>
            </div>
          </div>

          {/* 404 */}
          <div className="text-6xl font-bold text-gray-200 mb-4">404</div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Property Not Found
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            We couldn't find the property you're looking for. It may have been sold, 
            removed from our listings, or the link might be incorrect.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/properties')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Browse All Properties
            </button>

            <button
              onClick={() => navigate('/properties')}
              className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search Properties
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 text-gray-600 hover:text-blue-600 transition text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-semibold text-gray-900">Popular Searches:</span>
            {' '}
            <button 
              onClick={() => navigate('/properties')}
              className="text-blue-600 hover:underline"
            >
              Mumbai Properties
            </button>
            {', '}
            <button 
              onClick={() => navigate('/properties')}
              className="text-blue-600 hover:underline"
            >
              Luxury Villas
            </button>
            {', '}
            <button 
              onClick={() => navigate('/properties')}
              className="text-blue-600 hover:underline"
            >
              Apartments
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
