import React from 'react';
import { Shield } from 'lucide-react';

const SecurityNotice = () => {
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex items-start">
        <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-800">Security Notice</h4>
          <p className="text-sm text-blue-700 mt-1">
            Your payment information is encrypted and stored securely. We use industry-standard security measures to protect your financial data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice; 