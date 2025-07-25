import React from 'react'
import { Outlet, Route } from "react-router-dom";
import { DashboardLayout } from "../components/layout";
import ProtectedRoute from "../components/routing/ProtectedRoute";

import {
  Dashboard,
  Categories,
  Orders,
  Users,
  Staff,
  Notifications,
  Reports,
  Profile,
  Settings,
  Products,
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
      <Route path="staff" element={<Staff />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="reports" element={<Reports />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="products" element={<Products />} />
    </Route>
  </Route>,
];
