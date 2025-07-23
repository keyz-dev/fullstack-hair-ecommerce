import React, { createContext, useState } from 'react';
import { useAuth } from '../hooks';
import { ROLE_CONFIGS } from '../config/userRoles';

const BaseDashboardContext = createContext();

// This handles only UI-related dashboard state
export const BaseDashboardProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  const roleConfig = ROLE_CONFIGS[user?.role];

  const updateActiveNavFromPath = (currentPath) => {
    if (!roleConfig) return;

    const relativePath = currentPath.replace(roleConfig.basePath, '').replace(/^\//, '');
    const navItem = roleConfig.navItems.find(item => item.path === relativePath);

    if (navItem) {
      setActiveNavItem(relativePath);
      setPageTitle(navItem.label);
    }
  };

  const value = {
    user,
    roleConfig,
    pageTitle,
    activeNavItem,
    sidebarCollapsed,
    
    setPageTitle,
    setActiveNavItem,
    setSidebarCollapsed,
    updateActiveNavFromPath
  };

  return (
    <BaseDashboardContext.Provider value={value}>
      {children}
    </BaseDashboardContext.Provider>
  );
};

export { BaseDashboardContext };