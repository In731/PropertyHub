import { AlertTriangle, ArrowLeft, MailIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export function FormSubmissionError() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get error details from navigation state if available
  const errorDetails = location.state?.errorDetails || [];
  const errorMessage = location.state?.errorMessage || 
    "We couldn't process your request. Please check your information and try again.";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-orange-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Submission Failed
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {errorMessage}
          </p>

          {/* Error Details */}
          {errorDetails && errorDetails.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-red-800 mb-2">
                Please fix the following issues:
              </p>
              <ul className="space-y-2">
                {errorDetails.map((detail: string, index: number) => (
                  <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 font-bold">✕</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-blue-800 mb-2">💡 Quick Tips:</p>
            <ul className="space-y-1">
              <li className="text-sm text-blue-700">• Check all required fields are filled</li>
              <li className="text-sm text-blue-700">• Ensure email format is correct</li>
              <li className="text-sm text-blue-700">• Price and area must be numbers</li>
              <li className="text-sm text-blue-700">• Images must be under 5MB</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back & Edit
            </button>

            <button
              onClick={() => {
                alert('Contact support: support@propertyhub.com\nPhone: +91-1800-XXX-XXXX');
              }}
              className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
            >
              <MailIcon className="w-5 h-5" />
              Contact Support
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 text-gray-600 hover:text-blue-600 transition text-sm"
            >
              Cancel & Go Home
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Error Code: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
