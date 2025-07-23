import React, { useEffect, useState, useRef } from "react";
import { useBaseDashboard, useAuth } from "../../hooks";
import {
  Menu,
  Bell,
  Search,
  ChevronsLeft,
  ChevronDown,
  ChevronsRight,
} from "lucide-react";
import { Logo, Button } from "../ui";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { pageTitle, sidebarCollapsed, setSidebarCollapsed, roleConfig } =
    useBaseDashboard();

  const { logout, user } = useAuth();
  const imagePlaceholder =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  // State for controlling the dropdowns
  const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);

  // State and ref for the animated search bar
  const [isSearchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isLangDropdownOpen) setLangDropdownOpen(false);
    setShowUserDropdown(!showUserDropdown);
  };

  const handleLangClick = () => {
    if (showUserDropdown) setShowUserDropdown(false);
    setLangDropdownOpen(!isLangDropdownOpen);
  };

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!roleConfig) return null;

  return (
    <header className="bg-white shadow-sm p-2 flex items-center justify-between px-[3%]">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Logo size={150} destination={roleConfig.basePath} />

        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="md:hidden text-gray-600"
        >
          <Menu size={24} />
        </button>

        {/* Back Arrow - Desktop Only */}
        <Button
          onClickHandler={() => setSidebarCollapsed(!sidebarCollapsed)}
          additionalClasses="hidden md:block text-gray-500 hover:text-gray-800 min-h-[35px] min-w-[35px] h-[40px] w-[40px] p-0 grid place-items-center rounded-full bg-light_bg"
        >
          {sidebarCollapsed ? (
            <ChevronsRight size={24} className="text-secondary" />
          ) : (
            <ChevronsLeft size={24} className="text-secondary" />
          )}
        </Button>

        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          {pageTitle}
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Icons */}

        <div className="hidden md:flex items-center gap-2">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            onBlur={() => setSearchOpen(false)} // Close when focus is lost
            className={`
              transition-all duration-300 ease-in-out outline-none
              rounded-xs border focus:border-accent border-light_bg px-2 py-2 text-sm
              ${isSearchOpen ? "w-52 opacity-100" : "w-0 opacity-0"}
            `}
          />
          <button
            onClick={() => setSearchOpen(true)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Search size={22} />
          </button>
        </div>
        {/* Search icon for mobile remains simple */}
        <button className="md:hidden text-gray-600 hover:text-gray-800">
          <Search size={22} />
        </button>

        <button className="text-gray-600 hover:text-gray-800 relative">
          <Bell size={22} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* --- MODIFIED: Language Switcher --- */}
        <div className="relative hidden sm:flex">
          <button
            onClick={handleLangClick}
            className="flex items-center gap-1 text-gray-600"
          >
            <span>Eng (US)</span>
            <ChevronDown size={16} />
          </button>
          {isLangDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-10">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                English
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                French
              </a>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-3 rounded-sm hover:bg-light_bg px-4 py-2 cursor-pointer"
          >
            <img
              src={user.avatar || imagePlaceholder}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="hidden lg:block">
              <p className="font-semibold text-gray-800 text-sm">
                {user.name}
              </p>
              <p className="text-gray-500 text-xs">{user.role}</p>
            </div>
            <ChevronDown size={20} />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-gray-200 py-2 z-10">
              <a
                href=""
                onClick={() => navigate(roleConfig.basePath + "/profile")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                My Profile
              </a>
              <a
                href=""
                onClick={() => navigate(roleConfig.basePath + "/settings")}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <hr className="my-2 text-line_clr" />
              <a
                href=""
                onClick={logout}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Sign Out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
