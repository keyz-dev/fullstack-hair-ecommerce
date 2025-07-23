import React from 'react'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  return (
    <div className='w-full h-auto flex flex-col items-center gap-20 p-2 pt-0 lg:p-0 mb-3'>
      <Outlet />
    </div>
  )
}

export default DashboardLayout