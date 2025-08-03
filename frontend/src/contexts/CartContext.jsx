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
  const addToCart = useCallback((product, quantity = 1) => {
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
        // Add new item with converted price
        const convertedPrice = convertPrice(product.price, product.currency, userCurrency);
        return [...prevItems, { 
          ...product, 
          quantity,
          originalPrice: product.price,
          originalCurrency: product.currency,
          price: convertedPrice,
          currency: userCurrency
        }];
      }
    });
  }, [convertPrice, userCurrency]);

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

  // Update cart prices when currency changes
  useEffect(() => {
    setCartItems(prevItems => 
      prevItems.map(item => ({
        ...item,
        price: convertPrice(item.originalPrice || item.price, item.originalCurrency || item.currency, userCurrency),
        currency: userCurrency
      }))
    );
  }, [userCurrency, convertPrice]);

  // Calculate cart totals in user's currency
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
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