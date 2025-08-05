import { Route } from "react-router-dom";
import { Home, ProductDetails, Shop, Cart, Services, AboutUs, Blog, Checkout, OrderConfirmation, OrderTracking } from "../pages";
import { Login, Register, ForgotPassword, VerifyAccount, ResetPassword } from "../pages/auth";
import { HomeLayout, AuthLayout } from "../components/layout";

export const publicRoutes = [
  <Route key="home" path="/" element={<HomeLayout />}>
    <Route index element={<Home />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/order-confirmation" element={<OrderConfirmation />} />
    <Route path="/track-order" element={<OrderTracking />} />
    <Route path="/services" element={<Services />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/blog" element={<Blog />} />
  </Route>,
  <Route key="auth" element={<AuthLayout />}>
    <Route key="login" path="/login" element={<Login />} />
    <Route key="register" path="/register" element={<Register />} />
    <Route key="forgot-password" path="/forgot-password" element={<ForgotPassword />} />
    <Route key="verify-account" path="/verify-account" element={<VerifyAccount />} />
    <Route key="reset-password" path="/reset-password" element={<ResetPassword />} />
  </Route>,
];
