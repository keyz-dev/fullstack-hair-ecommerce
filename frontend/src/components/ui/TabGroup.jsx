import React from 'react';

const TabGroup = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`flex w-fit bg-gray-100 rounded-xs p-1 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
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
  );
};

export default TabGroup; 