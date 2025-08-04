import React from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '../../ui';

const DashboardErrorBoundary = ({ error, onRetry, loading }) => {
  const isNetworkError = error?.message?.includes('Network Error') || 
                        error?.message?.includes('ECONNRESET') ||
                        error?.message?.includes('fetch');

  const getErrorIcon = () => {
    if (isNetworkError) {
      return <WifiOff className="w-12 h-12 text-red-500" />;
    }
    return <AlertTriangle className="w-12 h-12 text-red-500" />;
  };

  const getErrorMessage = () => {
    if (isNetworkError) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    return error?.message || 'An unexpected error occurred while loading dashboard data.';
  };

  const getErrorTitle = () => {
    if (isNetworkError) {
      return 'Connection Error';
    }
    return 'Dashboard Error';
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="bg-white rounded-lg border border-red-200 p-8 max-w-md w-full text-center">
        {getErrorIcon()}
        
        <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
          {getErrorTitle()}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>

        <div className="space-y-3">
          <Button
            onClickHandler={onRetry}
            isDisabled={loading}
            additionalClasses="w-full primarybtn"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Retrying...' : 'Try Again'}
          </Button>

          {isNetworkError && (
            <div className="text-sm text-gray-500">
              <p>If the problem persists:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Check your internet connection</li>
                <li>• Verify the server is running</li>
                <li>• Contact support if needed</li>
              </ul>
            </div>
          )}
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Technical Details
            </summary>
            <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default DashboardErrorBoundary; 