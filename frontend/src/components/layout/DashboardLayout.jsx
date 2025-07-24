import React, { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useBaseDashboard } from "../../hooks";
import DashboardSidebar from "../common/DashboardSidebar";
import DashboardHeader from "../common/DashboardHeader";

const DashboardLayout = () => {
  const { user, roleConfig, updateActiveNavFromPath, sidebarCollapsed, setSidebarCollapsed } = useBaseDashboard();
  const location = useLocation();

  useEffect(() => {
    updateActiveNavFromPath(location.pathname);
  }, [location.pathname, updateActiveNavFromPath]);

  if (!user || !roleConfig) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <DashboardHeader />
      <div className="flex-1 flex overflow-hidden relative">
        <DashboardSidebar />
        
        {/* Mobile Overlay */}
        {!sidebarCollapsed && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => {
              setSidebarCollapsed(true);
            }}
          />
        )}
        
        {/* Main Content */}
        <main className={`
          flex-1 overflow-y-auto transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-0'}
          p-3 sm:p-4 lg:p-6
        `}>
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;