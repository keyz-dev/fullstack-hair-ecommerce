import React from 'react';
import { Input } from '../../../../ui';

const BankTransferConfig = ({ config, onConfigChange }) => {
  return (
    <div className="space-y-4">
      <Input
        label="Account Number"
        value={config.accountNumber || ''}
        onChangeHandler={(e) => onConfigChange('accountNumber', e.target.value)}
        placeholder="Bank account number"
        required
      />
      <Input
        label="Account Name"
        value={config.accountName || ''}
        onChangeHandler={(e) => onConfigChange('accountName', e.target.value)}
        placeholder="Account holder name"
        required
      />
      <Input
        label="Bank Name"
        value={config.bankName || ''}
        onChangeHandler={(e) => onConfigChange('bankName', e.target.value)}
        placeholder="e.g., BICEC, Afriland First Bank"
        required
      />
      <Input
        label="SWIFT Code"
        value={config.swiftCode || ''}
        onChangeHandler={(e) => onConfigChange('swiftCode', e.target.value)}
        placeholder="Optional"
      />
      <Input
        label="Routing Number"
        value={config.routingNumber || ''}
        onChangeHandler={(e) => onConfigChange('routingNumber', e.target.value)}
        placeholder="Optional"
      />
    </div>
  );
};

export default BankTransferConfig; 