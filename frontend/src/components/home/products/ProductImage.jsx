import { useState } from "react";
import { Eye } from "lucide-react";

const ProductImage = ({ images, name, badges, onQuickView }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const primaryImage = images && images.length > 0 ? images[0] : '/placeholder-product.jpg';
    const secondaryImage = images && images.length > 1 ? images[1] : null;
  
    const handleImageError = (e) => {
      console.warn('Product image failed to load:', primaryImage);
      setImageError(true);
      e.target.src = '/placeholder-product.jpg';
    };
  
    const handleImageLoad = () => {
      setImageLoaded(true);
    };
  
    return (
      <div className="relative aspect-square overflow-hidden bg-gray-50 group-product-image">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Primary Image */}
        <img 
          src={primaryImage}
          alt={name}
          className={`
            w-full h-full object-cover transition-all duration-500 ease-out
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            group-hover:scale-105
            ${secondaryImage ? 'group-hover:opacity-0' : ''}
          `}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
        
        {/* Secondary Image (hover effect) */}
        {secondaryImage && !imageError && (
          <img 
            src={secondaryImage}
            alt={`${name} - alternate view`}
            className="
              absolute inset-0 w-full h-full object-cover
              opacity-0 group-hover:opacity-100 group-hover:scale-105
              transition-all duration-500 ease-out
            "
            loading="lazy"
          />
        )}
  
        {/* Product Badges */}
        {badges}
  
        {/* Quick View Button */}
        <button
          onClick={onQuickView}
          className="
            absolute top-3 right-3 z-20
            w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full
            flex items-center justify-center
            opacity-0 group-hover:opacity-100
            transform translate-y-2 group-hover:translate-y-0
            transition-all duration-300 ease-out
            hover:bg-white hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-gray-300
          "
          title="Quick View"
          aria-label={`Quick view ${name}`}
        >
          <Eye size={16} className="text-gray-700" />
        </button>
      </div>
    );
  };

  export default ProductImage;