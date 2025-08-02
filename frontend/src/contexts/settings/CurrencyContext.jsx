import React, { createContext, useState, useEffect } from 'react';
import { currencyApi } from '../../api/currency';
import { toast } from 'react-toastify';

const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {
  const [currencies, setCurrencies] = useState([]);
  const [activeCurrencies, setActiveCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await currencyApi.getAllCurrencies();
      setCurrencies(response.currencies || []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await currencyApi.getActiveCurrencies();
      setActiveCurrencies(response.currencies || []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  const createCurrency = async (currencyData) => {
    try {
      setLoading(true);
      const response = await currencyApi.createCurrency(currencyData);
      setCurrencies(prev => [...prev, response.currency]);
      toast.success('Currency created successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create currency');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCurrency = async (id, currencyData) => {
    try {
      setLoading(true);
      const response = await currencyApi.updateCurrency(id, currencyData);
      setCurrencies(prev => 
        prev.map(currency => 
          currency._id === id ? response.currency : currency
        )
      );
      toast.success('Currency updated successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update currency');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCurrency = async (id) => {
    try {
      setLoading(true);
      await currencyApi.deleteCurrency(id);
      setCurrencies(prev => prev.filter(currency => currency._id !== id));
      toast.success('Currency deleted successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete currency');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const setBaseCurrency = async (id) => {
    try {
      setLoading(true);
      await currencyApi.setBaseCurrency(id);
      setCurrencies(prev => 
        prev.map(currency => ({
          ...currency,
          isBase: currency._id === id
        }))
      );
      toast.success('Base currency updated successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set base currency');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveCurrencies();
  }, []);

  const value = {
    currencies,
    activeCurrencies,
    loading,
    error,
    
    fetchCurrencies,
    fetchActiveCurrencies,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    setBaseCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}; 

export {
  CurrencyContext,
  CurrencyProvider,
}