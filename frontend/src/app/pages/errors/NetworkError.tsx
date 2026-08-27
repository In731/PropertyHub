import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NetworkError() {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8 text-center">
          {/* Animated Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            <div className="relative w-20 h-20 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center">
              <WifiOff className="w-10 h-10 text-gray-600 dark:text-gray-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Internet Connection
          </h1>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            Please check your internet connection and try again. Make sure you're connected to Wi-Fi or mobile data.
          </p>

          {/* Connection Tips */}
          <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-bold text-gray-800 dark:text-gray-300 mb-2">Quick Fixes:</p>
            <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
              <li>• Check if Wi-Fi or data is enabled</li>
              <li>• Restart your router or reconnect</li>
              <li>• Verify your browser is not in offline mode</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={handleRetry}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-600/20"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:border-blue-600 transition font-semibold flex items-center justify-center gap-2 text-sm"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
