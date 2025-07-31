import React, { createContext, useState, useEffect } from 'react';
import { paymentMethodApi } from '../../api/paymentMethod';
import { toast } from 'react-toastify';

const PaymentMethodContext = createContext();

const PaymentMethodProvider = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const res = await paymentMethodApi.getAllPaymentMethods();
      setPaymentMethods(res.paymentMethods || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const createPaymentMethod = async (data) => {
    setLoading(true);
    try {
      const res = await paymentMethodApi.createPaymentMethod(data);
      await fetchPaymentMethods();
      if (res.success) {
        toast.success('Payment method created successfully');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create payment method');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentMethod = async (id, data) => {
    setLoading(true);
    try {
      const res = await paymentMethodApi.updatePaymentMethod(id, data);
      setPaymentMethods((prev) =>
        prev.map((pm) => (pm._id === id ? res.paymentMethod : pm))
      );
      toast.success('Payment method updated successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update payment method');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentMethodConfig = async (id, configData) => {
    setLoading(true);
    try {
      const res = await paymentMethodApi.updatePaymentMethodConfig(id, configData);
      setPaymentMethods((prev) =>
        prev.map((pm) => (pm._id === id ? res.paymentMethod : pm))
      );
      toast.success('Payment method configuration updated successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update payment method configuration');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentMethod = async (id) => {
    setLoading(true);
    try {
      await paymentMethodApi.deletePaymentMethod(id);
      setPaymentMethods((prev) => prev.filter((pm) => pm._id !== id));
      toast.success('Payment method deleted successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete payment method');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentMethodStatus = async (id) => {
    setLoading(true);
    try {
      const res = await paymentMethodApi.togglePaymentMethodStatus(id);
      setPaymentMethods((prev) =>
        prev.map((pm) => (pm._id === id ? res.paymentMethod : pm))
      );
      toast.success('Payment method status updated successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <PaymentMethodContext.Provider
      value={{
        paymentMethods,
        loading,
        fetchPaymentMethods,
        createPaymentMethod,
        updatePaymentMethod,
        updatePaymentMethodConfig,
        deletePaymentMethod,
        togglePaymentMethodStatus,
      }}
    >
      {children}
    </PaymentMethodContext.Provider>
  );
};

export { PaymentMethodProvider, PaymentMethodContext };
