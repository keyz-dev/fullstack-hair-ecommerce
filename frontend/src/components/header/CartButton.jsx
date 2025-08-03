import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

const CartButton = () => {
  const { cartItemCount, formatCartTotal } = useCart();

  return (
    <Link
      to="/cart"
      className="relative bg-transparent text-black dark:text-white min-w-[20px] min-h-[20px] w-[40px] h-[40px] hover:bg-yellow-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors"
      aria-label="Cart"
      title={`Cart: ${formatCartTotal()}`}
    >
      <ShoppingCart size={22} />
      {cartItemCount > 0 && (
        <span className="absolute size-5 flex items-center justify-center p-[2px] rounded-full bg-accent text-white text-xs font-medium -right-1 -top-1 animate-pulse">
          {cartItemCount > 99 ? '99+' : cartItemCount}
        </span>
      )}
    </Link>
  );
};

export default CartButton;