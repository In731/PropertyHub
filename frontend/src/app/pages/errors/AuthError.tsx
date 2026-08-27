import { Lock, LogIn, UserPlus, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function AuthError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 relative">
            <Lock className="w-10 h-10 text-red-600 dark:text-red-400" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
              !
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Failed
          </h1>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            Your login credentials are incorrect or your session has expired. 
            Please try logging in again.
          </p>

          {/* Common Reasons */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-bold text-amber-900 dark:text-amber-300">Common reasons:</p>
            </div>
            <ul className="space-y-1 ml-6 text-xs text-amber-800 dark:text-amber-400">
              <li>• Incorrect email or password</li>
              <li>• Session expired due to inactivity</li>
              <li>• Account not yet registered</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-600/20"
            >
              <LogIn className="w-4 h-4" />
              Try Again
            </button>

            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition font-semibold text-sm"
            >
              Forgot Password?
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="w-full px-6 py-2.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition text-xs font-medium flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Create New Account
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 transition text-xs"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
