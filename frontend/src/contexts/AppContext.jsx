import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { ProductProvider } from "./ProductContext";
import { CartProvider } from "./CartContext";
import { PublicPaymentMethodProvider } from "./PublicPaymentMethodContext";
import { CurrencyProvider } from "./settings/CurrencyContext";
import { OrderProvider } from "./OrderContext";
import { PostProvider } from "./PostContext";

export const AppContext = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <CategoryProvider>
        <ProductProvider>
          <CartProvider>
            <PublicPaymentMethodProvider>
              <CurrencyProvider>
                <OrderProvider>
                  <PostProvider>
                    {children}
                  </PostProvider>
                </OrderProvider>
              </CurrencyProvider>
            </PublicPaymentMethodProvider>
          </CartProvider>
        </ProductProvider>
      </CategoryProvider>
    </AuthProvider>
  </ThemeProvider>
);