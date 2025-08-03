import React from 'react'
import { StatCard } from './'

const StatRenderer = ({ statCards, className, isLoading = false }) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-4`}>
        {statCards.map((card, index) => (
            <StatCard key={index} {...card} className={className} isLoading={isLoading} />
        ))}
    </div>
  )
}

export default StatRenderer