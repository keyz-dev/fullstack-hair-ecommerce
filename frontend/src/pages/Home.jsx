import React from 'react'
import { Hero, Categories, Collections, Guarantee } from '../components/home'

const Home = () => {
  return (
    <div className='w-full h-auto flex flex-col items-center gap-20 p-2 pt-0 lg:p-0 mb-3'>
      <Hero />
      <Categories />
      <Collections />
    //TODO: Add products section
    <br />
    //TODO: Add services section
    <br />
    //TODO: Add Testimonials section
    <br />
    //TODO: Add Q&A section
    <Guarantee />

    </div>
  )
}

export default Home