import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useBaseDashboard } from "../../hooks";
import * as Icons from "lucide-react";

const DashboardSidebar = () => {
  const { roleConfig, sidebarCollapsed, setSidebarCollapsed } = useBaseDashboard();
  const location = useLocation();
  const sidebarRef = useRef(null);
  
  // Track window size for responsive behavior
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const isMobile = windowWidth < 1024;
  const isCollapsedDesktop = sidebarCollapsed && !isMobile;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Debounce resize handler for better performance
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isActive = useCallback((path) => {
    const fullPath = path
      ? `${roleConfig?.basePath}/${path}`
      : roleConfig?.basePath;
    return location.pathname === fullPath;
  }, [location.pathname, roleConfig?.basePath]);

  // Handle navigation click on mobile (auto-close sidebar)
  const handleNavClick = useCallback(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, setSidebarCollapsed]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !sidebarCollapsed && isMobile) {
        setSidebarCollapsed(true);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarCollapsed, setSidebarCollapsed, isMobile]);

  // Handle swipe gestures on mobile
  useEffect(() => {
    if (!isMobile) return;

    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;

      // Swipe left to close sidebar
      if (swipeDistance > minSwipeDistance && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('touchstart', handleTouchStart, { passive: true });
      sidebar.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('touchstart', handleTouchStart);
        sidebar.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isMobile, sidebarCollapsed, setSidebarCollapsed]);

  // Handle overlay click on mobile
  const handleOverlayClick = useCallback(() => {
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, sidebarCollapsed, setSidebarCollapsed]);

  if (!roleConfig) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        role="navigation"
        aria-label="Main navigation"
        className={`
          bg-white shadow-lg transition-all duration-300 ease-in-out z-40
          overflow-hidden
          
          /* Scrollbar styles */
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          
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
        `}
      >
        {/* Mobile Header - Only show on mobile when sidebar is open */}
        {isMobile && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                aria-label="Close menu"
                type="button"
              >
                <Icons.X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav 
          className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto"
          role="list"
        >
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
                role="listitem"
                className={`
                  group relative flex items-center transition-all duration-200 p-3
                  ${isCollapsedDesktop
                    ? 'justify-center' 
                    : 'gap-3'
                  }
                  rounded-sm
                  ${active
                    ? `bg-accent-light text-accent ${!isCollapsedDesktop ? 'border-r-4 border-accent' : ''}`
                    : 'text-secondary hover:bg-accent-light hover:text-primary'
                  }
                `}
                aria-current={active ? 'page' : undefined}
              >
                {/* Icon */}
                <IconComponent 
                  className={`
                    w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 transition-colors
                    ${active ? 'text-accent' : 'text-gray-500 group-hover:text-gray-700'}
                  `}
                  aria-hidden="true"
                />
                
                {/* Label - Hidden when collapsed on desktop */}
                <span 
                  className={`
                    font-medium text-sm lg:text-base transition-all duration-200 whitespace-nowrap
                    ${isCollapsedDesktop ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}
                  `}
                >
                  {item.label}
                </span>

                {/* Tooltip for collapsed desktop sidebar */}
                {isCollapsedDesktop && (
                  <div 
                    className="invisible group-hover:visible absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    role="tooltip"
                  >
                    {item.label}
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-2 border-r-gray-900 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                )}

                {/* Active indicator dot for collapsed sidebar */}
                {active && isCollapsedDesktop && (
                  <div 
                    className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-accent rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - Only on desktop when expanded */}
        {!isMobile && !isCollapsedDesktop && (
          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              <p>Version 2.1.0</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default DashboardSidebar;