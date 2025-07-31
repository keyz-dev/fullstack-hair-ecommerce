import React from 'react';
import { Input, Select } from '../../../../ui';

const MobileMoneyConfig = ({ config, onConfigChange }) => {
  const providerOptions = [
    {label: 'Select Provider', value: ''},
    {label: 'MTN', value: 'MTN'},
    {label: 'ORANGE', value: 'ORANGE'},
    {label: 'OTHER', value: 'OTHER'}
  ];

  return (
    <div className="space-y-4">
      <Input
        label="Phone Number"
        value={config.phoneNumber || ''}
        onChangeHandler={(e) => onConfigChange('phoneNumber', e.target.value)}
        placeholder="e.g., 237612345678"
        required
      />
      <Input
        label="Account Name"
        value={config.accountName || ''}
        onChangeHandler={(e) => onConfigChange('accountName', e.target.value)}
        placeholder="Account holder name"
        required
      />
      <Select
        label="Provider"
        name="provider"
        value={config.provider || ''}
        onChange={(e) => onConfigChange('provider', e.target.value)}
        options={providerOptions}
        required={true}
      />
    </div>
  );
};

export default MobileMoneyConfig; 