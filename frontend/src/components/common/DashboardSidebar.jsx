import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useBaseDashboard } from "../../hooks";
import * as Icons from "lucide-react";

const DashboardSidebar = () => {
  const { roleConfig, sidebarCollapsed } = useBaseDashboard();
  const location = useLocation();

  if (!roleConfig) return null;

  const isActive = (path) => {
    const fullPath = path
      ? `${roleConfig.basePath}/${path}`
      : roleConfig.basePath;
    return location.pathname === fullPath;
  };

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? "w-20" : "w-56"
      }`}
    >
      {/* Navigation */}
      <nav className="p-3 space-y-3">
        {roleConfig.navItems.map((item) => {
          const IconComponent = Icons[item.icon] || Icons.Circle;
          const fullPath = item.path
            ? `${roleConfig.basePath}/${item.path}`
            : roleConfig.basePath;

          return (
            <Link
              key={item.path}
              to={fullPath}
              className={` ${
                sidebarCollapsed
                  ? "grid place-items-center"
                  : "flex items-center"
              } space-x-3 p-3 rounded-md transition-colors ${
                isActive(item.path)
                  ? sidebarCollapsed
                    ? "bg-accent-light text-accent"
                    : "bg-accent-light text-accent border-r-4 border-accent"
                  : "text-secondary hover:bg-light_bg"
              }`}
            >
              <IconComponent className="w-6 h-6" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
