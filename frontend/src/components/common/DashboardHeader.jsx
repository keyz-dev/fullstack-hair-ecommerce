import React, { useEffect, useState, useRef } from "react";
import { useBaseDashboard, useAuth } from "../../hooks";
import {
  Menu,
  Bell,
  Search,
  ChevronsLeft,
  ChevronDown,
  ChevronsRight,
  X
} from "lucide-react";
import { Logo, Button } from "../ui";
import { useNavigate } from "react-router-dom";
import { ThemeSelector, LanguageSelector } from "../header";

const DashboardHeader = () => {
  const { pageTitle, sidebarCollapsed, setSidebarCollapsed, roleConfig } =
    useBaseDashboard();

  const { logout, user } = useAuth();
  const imagePlaceholder =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (showMobileSearch && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [isSearchOpen, showMobileSearch]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!roleConfig) return null;

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 relative z-40">
        {/* Main Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          {/* Left Side */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Logo - Hidden on very small screens when title is long */}
            <div className="hidden xs:block sm:block">
              <Logo destination={roleConfig.basePath} />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Sidebar Toggle */}
            <Button
              onClickHandler={() => setSidebarCollapsed(!sidebarCollapsed)}
              additionalClasses="hidden lg:flex text-gray-500 hover:text-gray-800 min-h-[35px] min-w-[35px] h-[40px] w-[40px] p-0 items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronsRight size={20} className="text-gray-600" />
              ) : (
                <ChevronsLeft size={20} className="text-gray-600" />
              )}
            </Button>

            {/* Page Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
              {pageTitle}
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Desktop Search */}
            <div className="hidden lg:flex items-center gap-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                onBlur={() => setSearchOpen(false)}
                className={`
                  transition-all duration-300 ease-in-out outline-none
                  rounded-md border focus:border-accent border-gray-200 px-3 py-2 text-sm
                  ${isSearchOpen ? "w-52 opacity-100" : "w-0 opacity-0"}
                `}
              />
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={handleMobileSearch}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            {/* Desktop only: Language and Theme selectors */}
            <div className="hidden md:flex items-center gap-2">
              <LanguageSelector />
              <ThemeSelector />
            </div>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 lg:gap-3 rounded-md hover:bg-gray-100 px-2 lg:px-3 py-2 cursor-pointer transition-colors"
                aria-label="User menu"
              >
                <img
                  src={user.avatar || imagePlaceholder}
                  alt="User Avatar"
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover"
                />
                <div className="hidden xl:block text-left">
                  <p className="font-semibold text-gray-800 text-sm truncate max-w-24">
                    {user.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate max-w-24">{user.role}</p>
                </div>
                <ChevronDown size={16} className="hidden sm:block" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  {/* Mobile-only language and theme options */}
                  <div className="md:hidden border-b border-gray-100 pb-2 mb-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Preferences
                    </div>
                    <div className="px-4 py-2 flex flex-col gap-2">
                      <LanguageSelector />
                      <ThemeSelector />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigate(roleConfig.basePath + "/profile");
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate(roleConfig.basePath + "/settings");
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Settings
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="lg:hidden border-t border-gray-200 px-3 sm:px-4 py-3 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  ref={mobileSearchRef}
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                />
                <Search size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default DashboardHeader;