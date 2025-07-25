import React, { useState } from 'react'
import { ProductsMainView, AddProductPage } from '../../components/dashboard/products'

const Products = () => {
  const [view, setView] = useState('main')
  return (
    <div>
      {view === 'main' ? <ProductsMainView setView={setView}/> : <AddProductPage setView={setView}/>}
    </div>
  )
}

export default Products