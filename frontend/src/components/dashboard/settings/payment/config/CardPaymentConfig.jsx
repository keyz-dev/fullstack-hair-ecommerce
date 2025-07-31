import React, { useState } from 'react';
import { Input } from '../../../../ui';
import { Eye, EyeOff } from 'lucide-react';

const CardPaymentConfig = ({ config, onConfigChange }) => {
  const [showSecrets, setShowSecrets] = useState({});

  return (
    <div className="space-y-4">
      <Input
        label="Merchant ID"
        value={config.merchantId || ''}
        onChangeHandler={(e) => onConfigChange('merchantId', e.target.value)}
        placeholder="Your merchant ID"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          API Key
        </label>
        <div className="relative">
          <input
            type={showSecrets.apiKey ? 'text' : 'password'}
            value={config.apiKey || ''}
            onChange={(e) => onConfigChange('apiKey', e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your API key"
          />
          <button
            type="button"
            onClick={() => setShowSecrets(prev => ({ ...prev, apiKey: !prev.apiKey }))}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showSecrets.apiKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <Input
        label="Webhook URL"
        value={config.webhookUrl || ''}
        onChangeHandler={(e) => onConfigChange('webhookUrl', e.target.value)}
        placeholder="https://your-domain.com/webhook"
      />
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isLive"
          checked={config.isLive || false}
          onChange={(e) => onConfigChange('isLive', e.target.checked)}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="isLive" className="ml-2 block text-sm text-gray-700">
          Live Mode (Production)
        </label>
      </div>
    </div>
  );
};

export default CardPaymentConfig; 