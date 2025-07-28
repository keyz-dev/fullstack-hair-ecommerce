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
      { path: "orders", label: "Orders", icon: "Package" },
      { path: "bookings", label: "Bookings", icon: "Calendar" },
      { path: "categories", label: "Categories", icon: "Tag" },
      { path: "products", label: "Products", icon: "Package" },
      { path: "blog", label: "Blog", icon: "BookOpen" },
      { path: "posts", label: "Posts", icon: "FileText" },
      { path: "services", label: "Services", icon: "Briefcase" },
      { path: "users", label: "Users", icon: "Users" },
      { path: "notifications", label: "Notifications", icon: "Bell" },
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
