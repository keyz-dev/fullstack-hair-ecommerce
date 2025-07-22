import React from 'react'
import { Route } from "react-router-dom";
import { BookAppointment, Orders, Checkout } from '../pages'
import ProtectedRoute from '../components/routing/ProtectedRoute';
import { HomeLayout } from '../components/layout';

export const customerRoutes = [
  <Route key="customer" element={<ProtectedRoute allowedRoles={['customer']} />}>
    <Route element={<HomeLayout />}>
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/checkout" element={<Checkout />} />
    </Route>
  </Route>,
];
