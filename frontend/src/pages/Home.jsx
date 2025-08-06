import React from 'react'
import { useAuth } from '../hooks'
import { Navigate } from 'react-router-dom'
import { Hero, Categories, Collections, Products, Guarantee } from '../components/home'

const Home = () => {
  const { user } = useAuth()

  if( user){
    return <Navigate to={`/${user?.role}`} />
  }


  return (
    <div className='w-full h-auto flex flex-col items-center gap-20 p-2 pt-0 lg:p-0 mb-3'>
      <Hero />
      <Categories />
      <Collections />
      <Products />
      <Guarantee />
    </div>
  )
}

export default Home