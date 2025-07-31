import React, { createContext, useState, useEffect, useCallback } from 'react';
import { paymentMethodApi } from '../api/paymentMethod';

const PublicPaymentMethodContext = createContext();

const PublicPaymentMethodProvider = ({ children }) => {
  const [activePaymentMethods, setActivePaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivePaymentMethods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await paymentMethodApi.getActivePaymentMethods();
      setActivePaymentMethods(response.paymentMethods || []);
    } catch (err) {
      console.error('Error fetching active payment methods:', err);
      setError(err.message || 'Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchActivePaymentMethods();
  }, [fetchActivePaymentMethods]);

  const getPaymentMethodById = useCallback((id) => {
    return activePaymentMethods.find(method => method._id === id);
  }, [activePaymentMethods]);

  const getPaymentMethodsByType = useCallback((type) => {
    return activePaymentMethods.filter(method => method.type === type);
  }, [activePaymentMethods]);

  return (
    <PublicPaymentMethodContext.Provider
      value={{
        activePaymentMethods,
        loading,
        error,
        fetchActivePaymentMethods,
        getPaymentMethodById,
        getPaymentMethodsByType,
      }}
    >
      {children}
    </PublicPaymentMethodContext.Provider>
  );
};

export { PublicPaymentMethodProvider, PublicPaymentMethodContext }; 