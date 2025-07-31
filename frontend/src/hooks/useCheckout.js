import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateShipping } from '../services/shippingService';

const useCheckout = (cartItems, cartTotal, user, clearCart) => {
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);

  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Cameroon',
  });

  // Dynamic payment info based on selected payment method
  const [paymentInfo, setPaymentInfo] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Calculate order totals
  const shippingInfo = calculateShipping(shippingAddress.city, cartTotal);
  const tax = cartTotal * 0.195; // 19.5% VAT
  const processingFee = selectedPaymentMethod?.fees ? (cartTotal * selectedPaymentMethod.fees) / 100 : 0;
  const total = cartTotal + shippingInfo.cost + tax + processingFee;

  const orderSummary = {
    subtotal: cartTotal,
    shipping: shippingInfo.cost,
    tax,
    processingFee,
    total,
    shippingInfo
  };

  // Redirect if cart is empty (but not when processing an order or after order completion)
  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing && !isOrderCompleted) {
      navigate('/cart');
    }
  }, [cartItems.length, navigate, isProcessing, isOrderCompleted]);

  // Update customer info when user changes
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Initialize payment info when payment method changes
  useEffect(() => {
    if (selectedPaymentMethod) {
      const initialPaymentInfo = {};
      
      // Initialize fields based on payment method's customerFields
      selectedPaymentMethod.customerFields?.forEach(field => {
        initialPaymentInfo[field.name] = paymentInfo[field.name] || '';
      });
      
      setPaymentInfo(initialPaymentInfo);
    }
  }, [selectedPaymentMethod]);

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    // Clear previous payment info when changing payment method
    setPaymentInfo({});
  };

  const validateStep1 = () => {
    return customerInfo.firstName && 
           customerInfo.lastName && 
           customerInfo.email && 
           customerInfo.phone;
  };

  const validateStep2 = () => {
    return shippingAddress.address && 
           shippingAddress.city && 
           shippingAddress.state && 
           shippingAddress.postalCode;
  };

  const validateStep3 = () => {
    if (!selectedPaymentMethod) return false;
    
    // Validate based on payment method's customer fields
    if (selectedPaymentMethod.customerFields?.length > 0) {
      return selectedPaymentMethod.customerFields.every(field => {
        if (field.required) {
          const value = paymentInfo[field.name];
          return value && value.trim() !== '';
        }
        return true;
      });
    }
    
    // For payment methods without customer fields (like Cash on Delivery)
    return true;
  };

  const handleNextStep = () => {
    if (checkoutStep === 1 && validateStep1()) {
      setCheckoutStep(2);
    } else if (checkoutStep === 2 && validateStep2()) {
      setCheckoutStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (checkoutStep > 1) {
      setCheckoutStep(checkoutStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep3()) return;

    setIsProcessing(true);
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store cart items before clearing
      const orderCartItems = [...cartItems];
      
      // Set order completed flag to prevent cart redirect
      setIsOrderCompleted(true);
      
      // Redirect to order confirmation first
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: `ORD-${Date.now()}`,
          customerInfo,
          shippingAddress,
          orderSummary,
          selectedPaymentMethod,
          paymentInfo,
          cartItems: orderCartItems
        }
      });
      
      // Clear cart after navigation
      clearCart();
    } catch (error) {
      console.error('Order processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignIn = () => {
    navigate('/login', { state: { from: '/checkout' } });
  };

  return {
    // State
    checkoutStep,
    isProcessing,
    customerInfo,
    shippingAddress,
    paymentInfo,
    selectedPaymentMethod,
    orderSummary,
    
    // Handlers
    handleCustomerInfoChange,
    handleShippingAddressChange,
    handlePaymentInfoChange,
    handlePaymentMethodSelect,
    handleNextStep,
    handlePreviousStep,
    handlePlaceOrder,
    handleSignIn,
    
    // Validation
    validateStep1,
    validateStep2,
    validateStep3
  };
};

export default useCheckout; 