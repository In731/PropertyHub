import { Component, ErrorInfo, ReactNode } from 'react';
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
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 transition-colors">
          <div className="max-w-2xl w-full">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertOctagon className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Oops! Something Went Wrong
              </h1>

              {/* Message */}
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                We're sorry, but something unexpected happened. Our team has been notified and we're working to fix it.
              </p>

              {/* Actions */}
              <div className="space-y-3 max-w-md mx-auto">
                <button
                  onClick={this.handleReload}
                  className="w-full px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reload Page
                </button>

                <button
                  onClick={this.handleReset}
                  className="w-full px-6 py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-600 rounded-xl transition font-medium flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Go to Homepage
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If the problem persists, please{' '}
                  <button 
                    onClick={() => alert('Support: support@propertyhub.com')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    contact our support team
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
