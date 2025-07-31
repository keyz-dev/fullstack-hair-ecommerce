import React from 'react';
import { Input } from '../../../../ui';

const CryptoConfig = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-4">
      <Input
        label="Wallet Address"
        value={config.walletAddress || ''}
        onChangeHandler={(e) => onConfigChange('walletAddress', e.target.value)}
        placeholder="Your cryptocurrency wallet address"
        required
      />
      <Input
        label="Network"
        value={config.network || ''}
        onChangeHandler={(e) => onConfigChange('network', e.target.value)}
        placeholder="e.g., Bitcoin, Ethereum, USDT"
        required
      />
    </div>
  );
};

export default CryptoConfig; 