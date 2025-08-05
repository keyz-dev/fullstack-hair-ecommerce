import React, { useState } from 'react';
import { PaymentMethodSettings } from '../../components/dashboard/settings/payment';
import { GeneralSettings } from '../../components/dashboard/settings/general';
import { FadeInContainer } from '../../components/ui';

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
      <FadeInContainer delay={200} duration={600}>
        <div>
          <h1 className="text-2xl font-bold text-primary">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your application settings and payment methods.
          </p>
        </div>
      </FadeInContainer>

      {/* Custom Tab Navigation */}
      <FadeInContainer delay={400} duration={600}>
        <div className="flex w-fit bg-gray-100 rounded-xs p-1 mb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 px-4 py-2 text-sm font-medium rounded-xs transition-colors whitespace-nowrap
                ${activeTab === tab.key
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </FadeInContainer>

      <FadeInContainer delay={600} duration={600}>
        <div className="rounded-sm p-2">
          {renderTabContent()}
        </div>
      </FadeInContainer>
    </div>
  );
};

export default Settings;