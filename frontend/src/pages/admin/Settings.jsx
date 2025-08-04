import React, { useState } from 'react';
import { TabGroup } from '../../components/ui';
import { PaymentMethodSettings } from '../../components/dashboard/settings/payment';
import { GeneralSettings } from '../../components/dashboard/settings/general';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'payment-methods', label: 'Payment Methods' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'payment-methods':
        return <PaymentMethodSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your application settings and payment methods.
        </p>
      </div>

      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-6"
      />

      <div className="rounded-sm p-2">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Settings;