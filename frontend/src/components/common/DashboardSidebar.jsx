import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useBaseDashboard } from "../../hooks";
import * as Icons from "lucide-react";

const DashboardSidebar = () => {
  const { roleConfig, sidebarCollapsed, setSidebarCollapsed } = useBaseDashboard();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const isActive = (path) => {
    const fullPath = path
      ? `${roleConfig.basePath}/${path}`
      : roleConfig.basePath;
    return location.pathname === fullPath;
  };

  // Handle navigation click on mobile (auto-close sidebar)
  const handleNavClick = () => {
    if (window.innerWidth < 1024) { // lg breakpoint
      setSidebarCollapsed(true);
    }
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !sidebarCollapsed && window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarCollapsed, setSidebarCollapsed]);

  // Handle swipe gestures on mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeDistance = touchStartX - touchEndX;
      const minSwipeDistance = 50;

      // Swipe left to close sidebar
      if (swipeDistance > minSwipeDistance && !sidebarCollapsed && window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('touchstart', handleTouchStart);
      sidebar.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('touchstart', handleTouchStart);
        sidebar.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [sidebarCollapsed, setSidebarCollapsed]);

  if (!roleConfig) return null;

  return (
    <>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        style={{
          scrollbarWidth: "none",        // Firefox
          msOverflowStyle: "none",       // IE and Edge
        }}
        // Hide scrollbar for Webkit browsers
        // This will be complemented by a CSS class below if needed
        className={`
          bg-white shadow-lg transition-all overflow-auto duration-300 ease-in-out z-40
          
          /* Mobile: Fixed overlay sidebar */
          lg:relative lg:translate-x-0
          ${sidebarCollapsed 
            ? 'fixed -translate-x-full lg:w-20' 
            : 'fixed translate-x-0 lg:w-64'
          }
          
          /* Mobile dimensions */
          lg:h-auto h-full w-64 lg:border-r lg:border-gray-200
          
          /* Mobile positioning */
          top-0 left-0 lg:top-auto lg:left-auto

          [&::-webkit-scrollbar]:hidden
        `}
        
      >
        {/* Mobile Header - Only show on mobile when sidebar is open */}
        <div className="lg:hidden p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              aria-label="Close menu"
            >
              <Icons.X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto h-full lg:h-auto">
          {roleConfig.navItems.map((item) => {
            const IconComponent = Icons[item.icon] || Icons.Circle;
            const fullPath = item.path
              ? `${roleConfig.basePath}/${item.path}`
              : roleConfig.basePath;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path || 'home'}
                to={fullPath}
                onClick={handleNavClick}
                className={`
                  group relative flex items-center transition-all duration-200
                  ${sidebarCollapsed && window.innerWidth >= 1024
                    ? 'justify-center p-3 lg:p-4' 
                    : 'gap-3 p-3 lg:p-4'
                  }
                  rounded-sm
                  ${active
                    ? 'bg-accent-light text-accent border-r-4 border-accent'
                    : 'text-secondary hover:bg-accent-light hover:text-primary'
                  }
                `}
              >
                {/* Icon */}
                <IconComponent 
                  className={`
                    w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 transition-colors
                    ${active ? 'text-accent' : 'text-gray-500 group-hover:text-gray-700'}
                  `} 
                />
                
                {/* Label - Hidden when collapsed on desktop */}
                <span 
                  className={`
                    font-medium text-sm lg:text-base transition-all duration-200
                    ${sidebarCollapsed && window.innerWidth >= 1024 ? 'lg:hidden' : 'block'}
                  `}
                >
                  {item.label}
                </span>

                {/* Tooltip for collapsed desktop sidebar */}
                {sidebarCollapsed && (
                  <div className="hidden lg:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50">
                    {item.label}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-2 border-r-gray-900 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                )}

                {/* Active indicator dot for collapsed sidebar */}
                {active && sidebarCollapsed && (
                  <div className="hidden lg:block absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-accent rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - Only on desktop when expanded */}
        <div className={`
          hidden lg:block mt-auto p-4 border-t border-gray-200
          ${sidebarCollapsed ? 'lg:hidden' : 'lg:block'}
        `}>
          <div className="text-xs text-gray-500 text-center">
            <p>Version 2.1.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;