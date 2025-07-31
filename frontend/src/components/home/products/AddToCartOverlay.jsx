import { ShoppingCart, Heart, Check } from "lucide-react";

const AddToCartOverlay = ({ product, onAddToCart, isInStock, isInCart = false }) => {
    const handleAddToCart = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onAddToCart(product);
    };
  
    return (
      <div className="
        absolute inset-0 z-10
        bg-black/0 group-hover:bg-black/10
        transition-all duration-300 ease-out
        flex items-end justify-center
      ">
        <div className="
          w-full
          transform translate-y-[150%] group-hover:translate-y-0
          transition-all duration-300 ease-out
        ">
          {/* Primary Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`
              w-full py-4 font-semibold text-sm tracking-wide
              transition-all duration-200 ease-out
              flex items-center justify-center gap-2
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${isInCart
                ? 'bg-green-500 text-white hover:bg-green-600 active:scale-[0.98] cursor-pointer'
                : isInStock
                ? 'bg-primary text-white dark:bg-white dark:text-primary hover:bg-opacity-90 active:scale-[0.98] cursor-pointer'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }
            `}
            aria-label={isInCart ? `${product.name} already in cart` : isInStock ? `Add ${product.name} to cart` : 'Product out of stock'}
          >
            {isInCart ? (
              <>
                <Check size={16} />
                ADDED TO CART
              </>
            ) : isInStock ? (
              <>
                <ShoppingCart size={16} />
                ADD TO CART
              </>
            ) : (
              'OUT OF STOCK'
            )}
          </button>
        </div>
      </div>
    );
  };

  export default AddToCartOverlay;