import { AlertTriangle, ArrowLeft, MailIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function FormSubmissionError() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const errorDetails = location.state?.errorDetails || [];
  const errorMessage = location.state?.errorMessage || 
    "We couldn't process your request. Please check your information and try again.";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-orange-600 dark:text-orange-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Submission Failed
          </h1>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
            {errorMessage}
          </p>

          {/* Error Details */}
          {errorDetails && errorDetails.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl p-4 mb-6 text-left">
              <p className="text-xs font-bold text-red-800 dark:text-red-300 mb-2">
                Please fix the following issues:
              </p>
              <ul className="space-y-1.5">
                {errorDetails.map((detail: string, index: number) => (
                  <li key={index} className="text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
                    <span className="text-red-500 font-bold">✕</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2">💡 Quick Tips:</p>
            <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
              <li>• Check all required fields are filled</li>
              <li>• Ensure email format is correct</li>
              <li>• Price and area must be numbers</li>
              <li>• Images must be accessible URLs or valid uploads</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-600/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back & Edit
            </button>

            <button
              onClick={() => {
                alert('Contact support: support@propertyhub.com');
              }}
              className="w-full px-6 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:border-blue-600 transition font-semibold text-sm flex items-center justify-center gap-2"
            >
              <MailIcon className="w-4 h-4" />
              Contact Support
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 transition text-xs"
            >
              Cancel & Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
