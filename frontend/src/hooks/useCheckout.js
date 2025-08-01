import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateShipping } from '../services/shippingService';
import { orderApi } from '../api/order';
import api from '../api/index';
import { validateCustomerInfo, validateShippingInfo, validatePaymentInfo } from '../utils/checkoutValidation';
import { toast } from 'react-toastify';

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

  // Updated validation functions using the validation utilities
  const validateStep1 = () => {
    const validation = validateCustomerInfo(customerInfo);
    return validation.isValid;
  };

  const validateStep2 = () => {
    const validation = validateShippingInfo(shippingAddress);
    return validation.isValid;
  };

  const validateStep3 = () => {
    if (!selectedPaymentMethod) return false;
    
    // Use the comprehensive payment validation utility
    const validation = validatePaymentInfo({
      paymentMethod: selectedPaymentMethod.code || selectedPaymentMethod.type,
      ...paymentInfo
    });
    
    return validation.isValid;
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
      // Create order data
      const orderData = {
        user: user ? user._id : null,
        customerInfo,
        shippingAddress,
        cartItems: cartItems.map(item => ({
          product: item._id,
          variant: item.selectedVariant,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: selectedPaymentMethod._id,
        subtotal: cartTotal,
        shipping: shippingInfo.cost,
        tax,
        processingFee,
        total,
        notes: paymentInfo.notes || ''
      };

      // Create the order first
      const response = await orderApi.createOrder(orderData);
      const createdOrder = response.data;

      // Check if it's a mobile money payment and get the phone number
      const isMobileMoney = selectedPaymentMethod.type === 'MOBILE_MONEY' || 
                           selectedPaymentMethod.code === 'MOBILE_MONEY' ||
                           selectedPaymentMethod.code?.toLowerCase().includes('mobile');
      
      // Get phone number from payment info (could be named differently)
      const phoneNumber = paymentInfo.mobileNumber || paymentInfo.phoneNumber || paymentInfo.phone;

      if (isMobileMoney && phoneNumber) {
        try {
          const paymentResponse = await api.post('/payment/initiate', {
            orderId: createdOrder._id,
            phoneNumber: phoneNumber
          });

          if (paymentResponse.data.success) {
            toast.success('Payment initiated successfully');
          }
        } catch (paymentError) {
          console.error('Payment initiation failed:', paymentError);
          toast.error('Payment initiation failed');
        }
      }
      
      // Store cart items before clearing
      const orderCartItems = [...cartItems];
      
      // Set order completed flag to prevent cart redirect
      setIsOrderCompleted(true);
      
      // Redirect to order confirmation
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: createdOrder.orderNumber,
          orderId: createdOrder._id,
          customerInfo,
          shippingAddress,
          orderSummary,
          selectedPaymentMethod,
          paymentInfo,
          cartItems: orderCartItems,
          paymentStatus: createdOrder.paymentStatus
        }
      });
      
      // Clear cart after navigation
      clearCart();
    } catch (error) {
      console.error('Order processing failed:', error);
      // You might want to show an error message to the user here
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