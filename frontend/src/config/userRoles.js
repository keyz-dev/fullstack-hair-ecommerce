export const USER_ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  CLIENT: "client",
};

export const ROLE_CONFIGS = {
  [USER_ROLES.ADMIN]: {
    basePath: "/admin",
    displayName: "Administrator",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "categories", label: "Categories", icon: "Building2" },
      { path: "orders", label: "Orders", icon: "FileText" },
      { path: "users", label: "Users", icon: "FileText" },
      { path: "staff", label: "Staff", icon: "FileText" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
      { path: "reports", label: "Reports", icon: "BarChart3" },
      { path: "profile", label: "My Profile", icon: "User" },
      { path: "settings", label: "Settings", icon: "Settings" },
    ],
  },
  [USER_ROLES.STAFF]: {
    basePath: "/staff",
    displayName: "Staff",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
    ],
  },
  [USER_ROLES.CLIENT]: {
    basePath: "/client",
    displayName: "Client",
    navItems: [
      { path: "", label: "Overview", icon: "LayoutDashboard" },
      { path: "book-appointment", label: "Book Appointment", icon: "Calendar" },
      { path: "orders", label: "Orders", icon: "Bus" },
      { path: "checkout", label: "Checkout", icon: "Route" },
      { path: "profile", label: "My Profile", icon: "User" },
    ],
  },
};
