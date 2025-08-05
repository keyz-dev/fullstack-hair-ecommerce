import React from 'react';
import FadeInContainer from './FadeInContainer';

const StaggeredFadeIn = ({ 
  children, 
  staggerDelay = 150, 
  baseDelay = 200,
  duration = 600,
  direction = "up",
  className = ""
}) => {
  // Convert children to array if it's not already
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <FadeInContainer
          key={index}
          delay={baseDelay + (index * staggerDelay)}
          duration={duration}
          direction={direction}
        >
          {child}
        </FadeInContainer>
      ))}
    </div>
  );
};

export default StaggeredFadeIn; 