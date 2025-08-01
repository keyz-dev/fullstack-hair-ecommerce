import React from 'react'
import { Route } from "react-router-dom";
import { BookAppointment, Orders, Profile, Settings } from '../pages/client'
import { Home } from '../pages'
import ProtectedRoute from '../components/routing/ProtectedRoute';
import { DashboardLayout, HomeLayout } from '../components/layout';
export const clientRoutes = [
  <Route key="client" path='/client' element={<ProtectedRoute allowedRoles={['client']} />}>
    <Route element={<DashboardLayout />}>
      <Route path="book-appointment" element={<BookAppointment />} />
      <Route path="orders" element={<Orders />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
    </Route>
    <Route path="home" element={<HomeLayout />}>
      <Route path="" element={<Home />} />
    </Route>
  </Route>,
];
