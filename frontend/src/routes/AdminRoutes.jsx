import React from 'react'
import { Route } from "react-router-dom";
import { DashboardLayout } from "../components/layout";
import ProtectedRoute from "../components/routing/ProtectedRoute";

import {
  Dashboard,
  Categories,
  Orders,
  Users,
  Notifications,
  Profile,
  Products,
  Services,
  Bookings,
  Blogs,
  Posts,
} from "../pages/admin";


export const adminRoutes = [
  <Route
    key="admin"
    path="/admin"
    element={<ProtectedRoute allowedRoles={["admin"]} />}
  >
    <Route element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="categories" element={<Categories />} />
      <Route path="orders" element={<Orders />} />
      <Route path="users" element={<Users />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="profile" element={<Profile />} />
      <Route path="blog" element={<Blogs />} />
      <Route path="posts" element={<Posts />} />
      <Route path="services" element={<Services />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="products" element={<Products />} />
    </Route>
  </Route>,
];
