import React, { useState } from 'react';
import { Button, FormHeader } from '../../ui';
import { useService, useCategory } from '../../../hooks';
import { toast } from 'react-toastify';

const AddServicePage = ({ setView }) => {
  const { createService, loading } = useService();
  const { categories, fetchCategories } = useCategory();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'XAF',
    duration: '',
    category: '',
    image: null,
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Service name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Valid duration is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('currency', formData.currency);
    formDataToSend.append('duration', formData.duration);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('isActive', formData.isActive);
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    const success = await createService(formDataToSend);
    if (success) {
      setView('main');
    }
  };

  const currencyOptions = [
    { value: 'XAF', label: 'XAF (CFA Franc)' },
    { value: 'USD', label: 'USD (US Dollar)' },
    { value: 'EUR', label: 'EUR (Euro)' },
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat._id,
    label: cat.name
  }));

  return (
    <div className="max-w-4xl mx-auto">
      <FormHeader 
        title="Add New Service" 
        subtitle="Create a new service for your business"
        onBack={() => setView('main')}
      />
      
      <div className="bg-white rounded-sm shadow-sm border p-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter service name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter service description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {currencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="60"
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Image
            </label>
            <input
              type="file"
              onChange={(e) => handleInputChange('image', e.target.files[0])}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-primary">
              Active Service
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={() => setView('main')}
              additionalClasses="bg-gray-300 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              additionalClasses="bg-accent text-white hover:bg-accent/90"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServicePage; 