import React from 'react';
import CountUp from 'react-countup';
import { StatCard } from './';

const AnimatedStatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendValue, 
  colorTheme = "white", 
  className = "w-[180px] lg:w-[250px]",
  isLoading = false,
  duration = 2,
  ...props 
}) => {
  const isNumeric = typeof value === 'number' || !isNaN(parseFloat(value));

  const renderValue = () => {
    if (isLoading) {
      return <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>;
    }

    if (isNumeric && typeof value === 'number') {
      return (
        <CountUp
          end={value}
          duration={duration}
          separator=","
          decimals={0}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary"
        />
      );
    }

    return (
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
        {value}
      </div>
    );
  };

  return (
    <StatCard
      title={title}
      value={renderValue()}
      description={description}
      icon={icon}
      trend={trend}
      trendValue={trendValue}
      colorTheme={colorTheme}
      className={className}
      isLoading={isLoading}
      {...props}
    />
  );
};

export default AnimatedStatCard; 