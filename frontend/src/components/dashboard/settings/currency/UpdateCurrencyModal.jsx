import React, { useState, useEffect } from 'react';
import { ModalWrapper, FormHeader, Input, Button, Select } from '../../../ui';
import { X } from 'lucide-react';

const UpdateCurrencyModal = ({ isOpen, onClose, onSubmit, loading, initialData }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    exchangeRate: '',
    position: 'before',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        name: initialData.name || '',
        symbol: initialData.symbol || '',
        exchangeRate: initialData.exchangeRate?.toString() || '',
        position: initialData.position || 'before',
        isActive: initialData.isActive ?? true,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.code) newErrors.code = 'Currency code is required';
    if (!formData.name) newErrors.name = 'Currency name is required';
    if (!formData.symbol) newErrors.symbol = 'Currency symbol is required';
    if (!formData.exchangeRate) newErrors.exchangeRate = 'Exchange rate is required';
    if (formData.exchangeRate && parseFloat(formData.exchangeRate) <= 0) {
      newErrors.exchangeRate = 'Exchange rate must be positive';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await onSubmit({
      ...formData,
      exchangeRate: parseFloat(formData.exchangeRate),
    });

    if (success) {
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-2 lg:p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>
        
        <FormHeader
          title="Update Currency"
          description="Update currency details"
        />
        
        <form onSubmit={handleSubmit} className="form_container space-y-4">
          <Input
            label="Currency Code"
            name="code"
            value={formData.code}
            onChangeHandler={handleChange}
            error={errors.code}
            required
            placeholder="e.g., USD"
          />
          
          <Input
            label="Currency Name"
            name="name"
            value={formData.name}
            onChangeHandler={handleChange}
            error={errors.name}
            required
            placeholder="e.g., US Dollar"
          />
          
          <Input
            label="Symbol"
            name="symbol"
            value={formData.symbol}
            onChangeHandler={handleChange}
            error={errors.symbol}
            required
            placeholder="e.g., $"
          />
          
          <Input
            label="Exchange Rate"
            name="exchangeRate"
            type="number"
            step="0.0001"
            value={formData.exchangeRate}
            onChangeHandler={handleChange}
            error={errors.exchangeRate}
            required
            placeholder="Rate relative to base currency"
          />
          
          <Select
            label="Symbol Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            options={[
              { value: 'before', label: 'Before amount' },
              { value: 'after', label: 'After amount' },
            ]}
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="submit"
              additionalClasses="bg-accent text-white"
              isLoading={loading}
            >
              Update Currency
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default UpdateCurrencyModal; 