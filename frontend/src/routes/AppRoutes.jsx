import React from 'react'
import { Routes } from 'react-router-dom';
import { publicRoutes } from './PublicRoutes';
import { clientRoutes } from './ClientRoutes';
import { adminRoutes } from './AdminRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {publicRoutes}
      {clientRoutes}
      {adminRoutes}
    </Routes>
  )
}

export default AppRoutes