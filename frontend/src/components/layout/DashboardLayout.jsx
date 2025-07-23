import React, { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useBaseDashboard } from "../../hooks";
import DashboardSidebar from "../common/DashboardSidebar";
import DashboardHeader from "../common/DashboardHeader";

const DashboardLayout = () => {
  const { user, roleConfig, updateActiveNavFromPath } = useBaseDashboard();
  const location = useLocation();

  useEffect(() => {
    updateActiveNavFromPath(location.pathname);
  }, [location.pathname, updateActiveNavFromPath]);

  if (!user || !roleConfig) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      <div className="flex-1 flex overflow-hidden">
        <DashboardSidebar />
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
