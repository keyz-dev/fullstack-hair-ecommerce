import React, { useState, useEffect } from "react";
import { Button, HeroLoader } from "../ui";
import { heroSlides } from "../../constants/hero";
import { useImagePreloader } from "../../hooks";

const CYCLE_INTERVAL = 10000;

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Extract image URLs for preloading
  const imageUrls = heroSlides.map(slide => slide.image);
  const { imagesLoaded } = useImagePreloader(imageUrls);
  
  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 600);
    }
  };

  // Auto-cycle through slides every 10 seconds (only after images are loaded)
  useEffect(() => {
    if (!imagesLoaded) return;
    
    const interval = setInterval(nextSlide, CYCLE_INTERVAL);
    return () => clearInterval(interval);
  }, [imagesLoaded]);

  const current = heroSlides[currentSlide];

  return (
    <section className="h-[80vh] max-w-[100vh] md:max-w-[90vw] w-full relative overflow-hidden">
      {/* Loading Screen */}
      {!imagesLoaded && <HeroLoader />}
      
      {/* Background Images with Fade Animation */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            } ${
              // Mobile: focus left (where person is), Desktop: center
              'bg-left sm:bg-center'
            }`}
            style={{ 
              backgroundImage: `url(${slide.image})`,
              // Additional background positioning for fine control
              backgroundPosition: 'left center',
              // On larger screens, use center positioning
              ...(window.innerWidth >= 640 && { backgroundPosition: 'center center' })
            }}
          />
        ))}
      </div>

      {/* Content Overlay - Only visible when images are loaded */}
      <div className={`container w-full h-full relative z-10 transition-opacity duration-500 ${
        imagesLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="w-full sm:w-3/4 md:w-full h-[90%] flex flex-col items-end justify-center gap-3 sm:gap-7 px-2 sm:px-0">
          {/* Branding */}
          <div className="flex items-center justify-center gap-5">
            <hr className="border-none bg-accent w-[2px] h-16" />
            <div className="text-white">
              <p>Leila Brands</p>
              <p>&copy; 2024</p>
            </div>
          </div>
          
          {/* Subheading with Animation */}
          <div className="text-xs font-bold text-white h-8">
            {current.subheading && (
              <div
                className={`transition-all duration-1000 ${
                  isTransitioning 
                    ? 'opacity-0 -translate-y-4' 
                    : 'opacity-100 translate-y-0'
                }`}
              >
                <h2>{current.subheading}</h2>
                <hr className="border-none mt-3 bg-accent w-1/2 h-[2px]" />
              </div>
            )}
          </div>
          
          {/* Headline with Animation */}
          <div className="text-[42px] flex flex-col items-end sm:text-[64px] sm:leading-[80px] text-right">
            <h1
              className={`font-custom text-white text-right transition-opacity duration-1000 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <p>{current.heading.line1}</p>
              <p className="font-hero">
                <span className={`font-hero ${current.heading.line2Accent ? 'text-accent' : 'text-white'}`}>
                  {current.heading.line2}
                </span> {current.heading.line3}
              </p>
            </h1>
            
            {/* Tag with Animation */}
            <p
              className={`text-gray-200 mt-10 text-sm text-right w-[55%] transition-all duration-1000 ${
                isTransitioning 
                  ? 'opacity-0 translate-y-4' 
                  : 'opacity-100 translate-y-0'
              }`}
              style={{ 
                transitionDelay: isTransitioning ? '0ms' : '200ms' 
              }}
            >
              {current.tag}
            </p>
          </div>
          
          {/* CTA Section with Sequential Animation */}
          <div className="flex flex-col items-end gap-4">
            {/* HR Line */}
            <div
              className={`transition-all duration-1000 ${
                isTransitioning 
                  ? 'opacity-0 translate-y-4' 
                  : 'opacity-100 translate-y-0'
              }`}
              style={{ 
                transitionDelay: isTransitioning ? '0ms' : '400ms' 
              }}
            >
              <hr className="border-none bg-accent w-10 h-[2.5px]" />
            </div>
            
            {/* CTA Button */}
            <div
              className={`transition-all duration-1000 ${
                isTransitioning 
                  ? 'opacity-0 translate-y-4' 
                  : 'opacity-100 translate-y-0'
              }`}
              style={{ 
                transitionDelay: isTransitioning ? '0ms' : '600ms' 
              }}
            >
              <a href="#">
                <Button
                  text={current.cta}
                  additionalClasses="primarybtn"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Image Indicators - Only visible when images are loaded */}
      <div className={`absolute bottom-6 left-6 flex space-x-2 z-20 transition-opacity duration-500 ${
        imagesLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning && index !== currentSlide && imagesLoaded) {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentSlide(index);
                  setTimeout(() => setIsTransitioning(false), 100);
                }, 600);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-accent scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar - Only visible when images are loaded */}
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-black/20 z-20 transition-opacity duration-500 ${
        imagesLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div 
          className="h-full bg-accent transition-all duration-100 ease-linear"
          style={{
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
};

export default Hero;