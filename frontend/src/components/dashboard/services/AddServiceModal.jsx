import React, { useState, useEffect } from 'react';
import { ModalWrapper, Input, TextArea, Select, Button, FileUploader } from '../../ui';
import { useService, useCategory } from '../../../hooks';
import { toast } from 'react-toastify';

const AddServiceModal = ({ isOpen, onClose }) => {
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

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

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
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      currency: 'XAF',
      duration: '',
      category: '',
      image: null,
      isActive: true,
    });
    setErrors({});
    onClose();
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
    <ModalWrapper isOpen={isOpen} onClose={handleClose} title="Add New Service">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Service Name"
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            error={errors.name}
            required
          />
          
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(value) => handleInputChange('category', value)}
            error={errors.category}
            required
          />
        </div>

        <TextArea
          label="Description"
          value={formData.description}
          onChange={(value) => handleInputChange('description', value)}
          error={errors.description}
          required
          rows={4}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Price"
            type="number"
            value={formData.price}
            onChange={(value) => handleInputChange('price', value)}
            error={errors.price}
            required
            min="0"
            step="0.01"
          />
          
          <Select
            label="Currency"
            options={currencyOptions}
            value={formData.currency}
            onChange={(value) => handleInputChange('currency', value)}
          />
          
          <Input
            label="Duration (minutes)"
            type="number"
            value={formData.duration}
            onChange={(value) => handleInputChange('duration', value)}
            error={errors.duration}
            required
            min="1"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Service Image
          </label>
          <FileUploader
            onFileSelect={(file) => handleInputChange('image', file)}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
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
            onClick={handleClose}
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
    </ModalWrapper>
  );
};

export default AddServiceModal; 