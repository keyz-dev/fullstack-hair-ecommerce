import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { BaseDashboardProvider } from "./BaseDashboardContext";

export const AppContext = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <CategoryProvider>
        <BaseDashboardProvider>
          {children}
        </BaseDashboardProvider>
      </CategoryProvider>
    </AuthProvider>
  </ThemeProvider>
);
