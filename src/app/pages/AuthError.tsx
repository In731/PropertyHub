import { Lock, LogIn, UserPlus, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function AuthError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Lock className="w-12 h-12 text-red-600" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">!</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Authentication Failed
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your login credentials are incorrect or your session has expired. 
            Please try logging in again.
          </p>

          {/* Common Reasons */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-semibold text-amber-900">Common reasons:</p>
            </div>
            <ul className="space-y-1 ml-7">
              <li className="text-sm text-amber-800">• Incorrect email or password</li>
              <li className="text-sm text-amber-800">• Session expired due to inactivity</li>
              <li className="text-sm text-amber-800">• Account not yet verified</li>
              <li className="text-sm text-amber-800">• Browser cookies disabled</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Try Again
            </button>

            <button
              onClick={() => {
                // TODO: Implement forgot password
                alert('Forgot password functionality - Coming soon!');
              }}
              className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              Forgot Password?
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="w-full px-6 py-3 text-gray-600 hover:text-blue-600 transition text-sm flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create New Account
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 text-gray-600 hover:text-blue-600 transition text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Still having issues?{' '}
            <button 
              onClick={() => alert('Contact support: support@propertyhub.com')}
              className="text-blue-600 hover:underline font-medium"
            >
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
