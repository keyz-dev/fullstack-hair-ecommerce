import React from "react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { ProductProvider } from "./ProductContext";
import { CartProvider } from "./CartContext";
import { PublicPaymentMethodProvider } from "./PublicPaymentMethodContext";
import { OrderProvider } from "./OrderContext";
import { PostProvider } from "./PostContext";
import { CurrencyProvider } from "./CurrencyContext";

export const AppContext = ({ children }) => (
  <ThemeProvider>
    <CurrencyProvider>
      <AuthProvider>
        <CategoryProvider>
          <ProductProvider>
            <CartProvider>
              <PublicPaymentMethodProvider>
                <OrderProvider>
                  <PostProvider>
                    {children}
                  </PostProvider>
                </OrderProvider>
              </PublicPaymentMethodProvider>
            </CartProvider>  
          </ProductProvider>
        </CategoryProvider>
      </AuthProvider>
    </CurrencyProvider>
  </ThemeProvider>
);