import React from 'react';

const TabGroup = ({ tabs, activeTab, onTabChange, className = '' }) => {
  const activeTabData = tabs.find(tab => tab.key === activeTab || tab.id === activeTab);

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className="flex w-fit bg-gray-100 rounded-xs p-1 mb-2">
        {tabs.map((tab) => {
          const tabKey = tab.key || tab.id;
          return (
            <button
              key={tabKey}
              onClick={() => onTabChange(tabKey)}
              className={`
                flex-1 px-4 py-2 text-sm font-medium rounded-xs transition-colors whitespace-nowrap
                ${activeTab === tabKey
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }
              `}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTabData ? activeTabData.component : (
        <div className="p-6 text-center text-gray-500">
          No content available for this tab.
        </div>
      )}
    </div>
  );
};

export default TabGroup; 