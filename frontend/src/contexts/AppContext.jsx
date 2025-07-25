import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { BaseDashboardProvider } from "./BaseDashboardContext";
import { ProductProvider } from "./ProductContext";

export const AppContext = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <CategoryProvider>
        <BaseDashboardProvider>
          <ProductProvider>
            {children}
          </ProductProvider>
        </BaseDashboardProvider>
      </CategoryProvider>
    </AuthProvider>
  </ThemeProvider>
);
