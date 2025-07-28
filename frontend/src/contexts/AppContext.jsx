import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { ProductProvider } from "./ProductContext";

export const AppContext = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <CategoryProvider>
        <ProductProvider>
        {children}
        </ProductProvider>
      </CategoryProvider>
    </AuthProvider>
  </ThemeProvider>
);