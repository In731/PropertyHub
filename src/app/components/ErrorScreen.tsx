import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

export interface ErrorScreenProps {
  icon: LucideIcon;
  title: string;
  message: string;
  details?: string[];
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  tertiaryAction?: {
    label: string;
    onClick: () => void;
  };
  showHomeLink?: boolean;
}

export function ErrorScreen({
  icon: Icon,
  title,
  message,
  details,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  showHomeLink = true,
}: ErrorScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-12 h-12 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {title}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            {message}
          </p>

          {/* Error Details */}
          {details && details.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-red-800 mb-2">Error Details:</p>
              <ul className="space-y-1">
                {details.map((detail, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {primaryAction.label}
              </button>
            )}

            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                {secondaryAction.label}
              </button>
            )}

            {tertiaryAction && (
              <button
                onClick={tertiaryAction.onClick}
                className="w-full px-6 py-3 text-gray-600 hover:text-blue-600 transition text-sm"
              >
                {tertiaryAction.label}
              </button>
            )}

            {showHomeLink && (
              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 text-gray-600 hover:text-blue-600 transition text-sm"
              >
                ← Back to Home
              </button>
            )}
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help?{' '}
            <button className="text-blue-600 hover:underline">
              Contact Support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
