import React from 'react'
import { Routes } from 'react-router-dom';
import { publicRoutes } from './PublicRoutes';
import { customerRoutes } from './CustomerRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {publicRoutes}
      {customerRoutes}
    </Routes>
  )
}

export default AppRoutes