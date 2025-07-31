import React from 'react';
import { ChevronRight } from 'lucide-react';

const HeroSection = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  backgroundImage = '/src/assets/images/shop-hero-bg.jpg',
  className = "",
  children 
}) => {
  return (
    <section 
      className={`relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center justify-center mb-4 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
                  )}
                  <span className={`${index === breadcrumbs.length - 1 ? 'text-white' : 'text-white/80'}`}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          )}
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
              {subtitle}
            </p>
          )}
          
          {/* Additional children content */}
          {children}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection; 