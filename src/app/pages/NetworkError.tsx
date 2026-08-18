import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NetworkError() {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Animated Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <WifiOff className="w-12 h-12 text-gray-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            No Internet Connection
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Please check your internet connection and try again. Make sure you're connected to Wi-Fi or have mobile data enabled.
          </p>

          {/* Connection Tips */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-gray-800 mb-2">Quick Fixes:</p>
            <ul className="space-y-1">
              <li className="text-sm text-gray-700">• Check if Wi-Fi is turned on</li>
              <li className="text-sm text-gray-700">• Try switching between Wi-Fi and mobile data</li>
              <li className="text-sm text-gray-700">• Restart your router or modem</li>
              <li className="text-sm text-gray-700">• Move closer to your Wi-Fi router</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </button>
          </div>

          {/* Offline Mode Note */}
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800">
              💡 <span className="font-semibold">Tip:</span> Some pages may still be available in offline mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
