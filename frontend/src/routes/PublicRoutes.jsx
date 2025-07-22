import { Route } from "react-router-dom";
import { Home, ProductDetails, Shop, Cart, Services } from "../pages";
import { Login, Register } from "../pages/auth";
import { HomeLayout, AuthLayout } from "../components/layout";

export const publicRoutes = [
  <Route key="home" path="/" element={<HomeLayout />}>
    <Route index element={<Home />} />
    <Route path="/product/:id" element={<ProductDetails />} />
    <Route path="/shop" element={<Shop />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/services" element={<Services />} />
  </Route>,
  <Route key="auth" element={<AuthLayout />}>
    <Route key="login" path="/login" element={<Login />} />
    <Route key="register" path="/register" element={<Register />} />
  </Route>
];
