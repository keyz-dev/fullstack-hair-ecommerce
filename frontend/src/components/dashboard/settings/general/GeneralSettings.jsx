import React, { useState, useEffect } from 'react';
import { Input, Select, Button } from '../../../ui';
import { useSettings } from '../../../../hooks';

const GeneralSettings = () => {
  const { settings, loading, error, getSetting, updateSettings } = useSettings();

  // Local state for form fields
  const [form, setForm] = useState({
    default_currency: 'XAF',
    default_language: 'en',
    order_auto_approval: false,
    email_notifications: true,
    stock_management: true,
  });
  const [saving, setSaving] = useState(false);

  // Populate form when settings are loaded
  useEffect(() => {
    if (settings && settings.length > 0) {
      setForm({
        default_currency: getSetting('default_currency') || 'XAF',
        default_language: getSetting('default_language') || 'en',
        order_auto_approval: !!getSetting('order_auto_approval'),
        email_notifications: !!getSetting('email_notifications'),
        stock_management: !!getSetting('stock_management'),
      });
    }
  }, [settings, getSetting]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateSettings([
        { key: 'default_currency', value: form.default_currency },
        { key: 'default_language', value: form.default_language },
        { key: 'order_auto_approval', value: form.order_auto_approval },
        { key: 'email_notifications', value: form.email_notifications },
        { key: 'stock_management', value: form.stock_management },
      ]);
      if (success) {
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-primary">General Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure basic application settings and preferences.
          </p>
        </div>
        <div className="bg-white shadow rounded-sm p-6 max-w-2xl">
          <div className="text-center py-8">Loading settings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-primary">General Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure basic application settings and preferences.
          </p>
        </div>
        <div className="bg-white shadow rounded-sm p-6 max-w-2xl">
          <div className="text-center text-red-500 py-8">
            Error loading settings: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">General Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure basic application settings and preferences.
        </p>
      </div>

      <div className="bg-white shadow rounded-sm p-6 max-w-2xl">
        <form className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-primary mb-4">Defaults</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Default Currency"
                name="default_currency"
                value={form.default_currency}
                onChange={handleChange}
                options={[
                  { value: 'XAF', label: 'XAF - Central African CFA Franc' },
                  { value: 'USD', label: 'USD - US Dollar' },
                  { value: 'EUR', label: 'EUR - Euro' },
                  { value: 'GBP', label: 'GBP - British Pound' },
                ]}
                required
              />
              <Select
                label="Default Language"
                name="default_language"
                value={form.default_language}
                onChange={handleChange}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'fr', label: 'French' },
                  { value: 'es', label: 'Spanish' },
                ]}
                required
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-primary mb-4">Order & Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="order_auto_approval"
                  checked={form.order_auto_approval}
                  onChange={handleChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-primary">Auto-approve orders</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="email_notifications"
                  checked={form.email_notifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-primary">Send email notifications for new orders</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="stock_management"
                  checked={form.stock_management}
                  onChange={handleChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-primary">Enable automatic stock management</span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <Button
              type="button"
              onClick={handleSave}
              isLoading={saving}
              additionalClasses="bg-accent text-white"
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneralSettings;