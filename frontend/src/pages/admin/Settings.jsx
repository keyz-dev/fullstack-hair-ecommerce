import React, { useState } from 'react';
import { TabGroup } from '../../components/ui';
import { CurrencySettings } from '../../components/dashboard/settings/currency';
import { PaymentMethodSettings } from '../../components/dashboard/settings/payment';
import { GeneralSettings } from '../../components/dashboard/settings/general';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'currencies', label: 'Currencies' },
    { key: 'payment-methods', label: 'Payment Methods' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'currencies':
        return <CurrencySettings />;
      case 'payment-methods':
        return <PaymentMethodSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your application settings, currencies, and payment methods.
        </p>
      </div>

      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-6"
      />

      <div className="bg-white rounded-sm">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;