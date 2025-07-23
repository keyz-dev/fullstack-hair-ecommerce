import React from 'react'
import { Hero, Categories } from '../components/home'

const Home = () => {
  return (
    <div className='w-full h-auto flex flex-col items-center gap-20 p-2 pt-0 lg:p-0 mb-3'>
      <Hero />
      <Categories />
    </div>
  )
}

export default Home