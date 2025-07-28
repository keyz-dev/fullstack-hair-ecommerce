import React, { createContext, useState, useEffect } from 'react';
import { settingsApi } from '../../api/settings';
import { toast } from 'react-toastify';

const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await settingsApi.getSettings();
      setSettings(response.settings || []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settingsArray) => {
    try {
      setLoading(true);
      const response = await settingsApi.updateSettings(settingsArray);
      setSettings(response.settings || []);
      toast.success('Settings updated successfully');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (key) => settings.find(s => s.key === key)?.value;

  const value = {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    getSetting,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 

export {
  SettingsContext,
  SettingsProvider,
}