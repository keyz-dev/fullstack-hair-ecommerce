import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { ProductProvider } from "./ProductContext";
import { CartProvider } from "./CartContext";
import { PublicPaymentMethodProvider } from "./PublicPaymentMethodContext";

export const AppContext = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <CategoryProvider>
        <ProductProvider>
          <CartProvider>
            <PublicPaymentMethodProvider>
              {children}
            </PublicPaymentMethodProvider>
          </CartProvider>
        </ProductProvider>
      </CategoryProvider>
    </AuthProvider>
  </ThemeProvider>
);