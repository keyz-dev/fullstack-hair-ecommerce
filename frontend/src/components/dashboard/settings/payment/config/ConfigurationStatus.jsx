import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ConfigurationStatus = ({ isConfigured }) => {
  return (
    <div className={`mb-6 p-4 rounded-md border ${
      isConfigured 
        ? 'bg-green-50 border-green-200' 
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-center">
        {isConfigured ? (
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
        ) : (
          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
        )}
        <span className={`text-sm font-medium ${
          isConfigured ? 'text-green-800' : 'text-yellow-800'
        }`}>
          {isConfigured ? 'Configuration Complete' : 'Configuration Required'}
        </span>
      </div>
      <p className={`text-sm mt-1 ${
        isConfigured ? 'text-green-700' : 'text-yellow-700'
      }`}>
        {isConfigured 
          ? 'This payment method is properly configured and ready to use.'
          : 'Please complete the configuration below to enable this payment method.'
        }
      </p>
    </div>
  );
};

export default ConfigurationStatus; 