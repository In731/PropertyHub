import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Log to error reporting service (e.g., Sentry, LogRocket)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              {/* Icon */}
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertOctagon className="w-12 h-12 text-red-600" />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Oops! Something Went Wrong
              </h1>

              {/* Message */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                We're sorry, but something unexpected happened. Our team has been notified and we're working to fix it.
              </p>

              {/* Error Details (Development Only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left max-h-64 overflow-y-auto">
                  <p className="text-sm font-semibold text-red-800 mb-2">
                    Error Details (Development Mode):
                  </p>
                  <pre className="text-xs text-red-700 whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3 max-w-md mx-auto">
                <button
                  onClick={this.handleReload}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reload Page
                </button>

                <button
                  onClick={this.handleReset}
                  className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Go to Homepage
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  If the problem persists, please{' '}
                  <button 
                    onClick={() => alert('Support: support@propertyhub.com')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    contact our support team
                  </button>
                </p>
              </div>
            </div>

            {/* Error Code */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Error ID: {Date.now().toString(36).toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
