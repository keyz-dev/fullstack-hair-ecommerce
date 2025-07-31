import React from 'react';
import { AlertCircle } from 'lucide-react';
import { MobileMoneyConfig, BankTransferConfig, CardPaymentConfig, PayPalConfig, CryptoConfig } from './index';

const ConfigFormRenderer = ({ paymentMethod, config, onConfigChange }) => {
  const renderConfigForm = () => {
    switch (paymentMethod?.type) {
      case 'MOBILE_MONEY':
        return <MobileMoneyConfig config={config} onConfigChange={onConfigChange} />;
      case 'BANK_TRANSFER':
        return <BankTransferConfig config={config} onConfigChange={onConfigChange} />;
      case 'CARD_PAYMENT':
        return <CardPaymentConfig config={config} onConfigChange={onConfigChange} />;
      case 'PAYPAL':
        return <PayPalConfig config={config} onConfigChange={onConfigChange} />;
      case 'CRYPTO':
        return <CryptoConfig config={config} onConfigChange={onConfigChange} />;
      default:
        return (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No configuration required for this payment method.</p>
          </div>
        );
    }
  };

  return (
    <div className="mb-6">
      {renderConfigForm()}
    </div>
  );
};

export default ConfigFormRenderer; 