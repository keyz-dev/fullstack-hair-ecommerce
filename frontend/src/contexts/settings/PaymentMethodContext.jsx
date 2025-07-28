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
    } catch (err) {
      toast.error('Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const createPaymentMethod = async (data) => {
    setLoading(true);
    try {
      const res = await paymentMethodApi.createPaymentMethod(data);
      setPaymentMethods((prev) => [...prev, res.paymentMethod]);
      toast.success('Payment method created');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create payment method');
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
      toast.success('Payment method updated');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update payment method');
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
      toast.success('Payment method deleted');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete payment method');
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
      toast.success('Payment method status updated');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
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
        deletePaymentMethod,
        togglePaymentMethodStatus,
      }}
    >
      {children}
    </PaymentMethodContext.Provider>
  );
};

export { PaymentMethodProvider, PaymentMethodContext };
