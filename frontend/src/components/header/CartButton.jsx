import React from "react";
import { ShoppingCart } from "lucide-react";

const CartButton = ({ count = 0 }) => (
  <button
    type="button"
    className="relative bg-transparent text-black dark:text-white min-w-[20px] min-h-[20px] w-[40px] h-[40px] hover:bg-yellow-100 dark:hover:bg-gray-800 rounded-full flex items-center justify-center"
    aria-label="Cart"
  >
    <ShoppingCart size={22} />
    <span className="absolute size-5 flex items-center justify-center p-[2px] rounded-full bg-primary text-white text-xs font-light -right-1 -top-1">
      {count}
    </span>
  </button>
);

export default CartButton;