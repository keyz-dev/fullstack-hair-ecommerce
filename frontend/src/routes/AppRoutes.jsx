import React from 'react'
import { Routes } from 'react-router-dom';
import { publicRoutes } from './PublicRoutes';
import { customerRoutes } from './CustomerRoutes';
import { adminRoutes } from './AdminRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {publicRoutes}
      {customerRoutes}
      {adminRoutes}
    </Routes>
  )
}

export default AppRoutes