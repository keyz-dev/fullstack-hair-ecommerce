import { ShoppingCart, Heart } from "lucide-react";

const AddToCartOverlay = ({ product, onAddToCart, onAddToWishlist, isInStock }) => {
    const handleAddToCart = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onAddToCart(product);
    };
  
    const handleAddToWishlist = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onAddToWishlist(product);
    };
  
    return (
      <div className="
        absolute inset-0 z-10
        bg-black/0 group-hover:bg-black/10
        transition-all duration-300 ease-out
        flex items-end justify-center
      ">
        <div className="
          w-full bg-gray-900/90 backdrop-blur-sm
          p-4
          transform translate-y-full group-hover:translate-y-0
          transition-all duration-300 ease-out
        ">
          {/* Primary Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`
              w-full py-3 px-4 font-semibold text-sm tracking-wide
              transition-all duration-200 ease-out
              flex items-center justify-center gap-2
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isInStock
                ? 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-white active:scale-[0.98]'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }
            `}
            aria-label={isInStock ? `Add ${product.name} to cart` : 'Product out of stock'}
          >
            {isInStock ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>
        </div>
      </div>
    );
  };

  export default AddToCartOverlay;