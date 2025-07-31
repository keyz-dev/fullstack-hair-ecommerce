import React, { useState } from 'react';
import { Input } from '../../../../ui';
import { Eye, EyeOff } from 'lucide-react';

const PayPalConfig = ({ config, onConfigChange }) => {
  const [showSecrets, setShowSecrets] = useState({});

  return (
    <div className="space-y-4">
      <Input
        label="Client ID"
        value={config.clientId || ''}
        onChangeHandler={(e) => onConfigChange('clientId', e.target.value)}
        placeholder="Your PayPal Client ID"
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Client Secret
        </label>
        <div className="relative">
          <input
            type={showSecrets.clientSecret ? 'text' : 'password'}
            value={config.clientSecret || ''}
            onChange={(e) => onConfigChange('clientSecret', e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Your PayPal Client Secret"
            required
          />
          <button
            type="button"
            onClick={() => setShowSecrets(prev => ({ ...prev, clientSecret: !prev.clientSecret }))}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showSecrets.clientSecret ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mode
        </label>
        <select
          value={config.mode || 'sandbox'}
          onChange={(e) => onConfigChange('mode', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="sandbox">Sandbox (Testing)</option>
          <option value="live">Live (Production)</option>
        </select>
      </div>
      <Input
        label="Webhook ID"
        value={config.webhookId || ''}
        onChangeHandler={(e) => onConfigChange('webhookId', e.target.value)}
        placeholder="Optional"
      />
    </div>
  );
};

export default PayPalConfig; 