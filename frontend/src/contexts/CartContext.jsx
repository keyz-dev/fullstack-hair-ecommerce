import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useCurrency } from '../hooks/useCurrency';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { convertPrice, formatPrice, userCurrency } = useCurrency();
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        localStorage.removeItem('cart'); // Clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart with currency conversion
  const addToCart = useCallback(async (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item with original price and currency
        // Price conversion will be handled by the useEffect below
        return [...prevItems, { 
          ...product, 
          quantity,
          originalPrice: product.price,
          originalCurrency: product.currency,
          price: product.price, // Keep original price initially
          currency: product.currency // Keep original currency initially
        }];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Update cart prices when currency changes - handle async conversion
  useEffect(() => {
    const updatePrices = async () => {
      const updatedItems = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const convertedPrice = await convertPrice(
              item.originalPrice || item.price, 
              item.originalCurrency || item.currency, 
              userCurrency
            );
            return {
              ...item,
              price: convertedPrice,
              currency: userCurrency
            };
          } catch (error) {
            console.error('Error converting price for item:', item._id, error);
            // Fallback to original price if conversion fails
            return {
              ...item,
              price: item.originalPrice || item.price,
              currency: item.originalCurrency || item.currency
            };
          }
        })
      );
      
      setCartItems(updatedItems);
    };

    if (cartItems.length > 0) {
      updatePrices();
    }
  }, [userCurrency, convertPrice, cartItems.length]);

  // Calculate cart totals in user's currency
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      // Ensure price is a number, not a Promise
      const price = typeof item.price === 'number' ? item.price : 0;
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  // Count unique items (not total quantity)
  const cartItemCount = cartItems.length;

  // Check if item is in cart
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item._id === productId);
  }, [cartItems]);

  // Get item quantity in cart
  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item._id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  // Format cart total price
  const formatCartTotal = useCallback(() => {
    return formatPrice(cartTotal, userCurrency);
  }, [cartTotal, formatPrice, userCurrency]);

  const value = {
    cartItems,
    cartTotal,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    formatCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider }; 