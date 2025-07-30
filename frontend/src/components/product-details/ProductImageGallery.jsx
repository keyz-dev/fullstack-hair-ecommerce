import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImageGallery = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-advance images every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleImageChange = (index) => {
    if (index === currentImageIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const nextImage = () => {
    handleImageChange((currentImageIndex + 1) % images.length);
  };

  const prevImage = () => {
    handleImageChange(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
  };

  const currentImage = images[currentImageIndex] || '/placeholder-product.jpg';

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-square bg-gray-50 rounded-sm overflow-hidden">
        {/* Main Image */}
        <img
          src={currentImage}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
          onError={(e) => {
            e.target.src = '/placeholder-product.jpg';
          }}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-sm px-2 py-1 rounded">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageChange(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                index === currentImageIndex
                  ? 'border-accent scale-105 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery; 