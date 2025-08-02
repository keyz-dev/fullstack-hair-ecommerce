import React, { useState, useEffect } from 'react';
import { ModalWrapper, Button, Input, Select, TextArea, FileUploader } from '../../ui';
import { useService } from '../../../hooks';
import { useCategory } from '../../../hooks';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';

const UpdateServiceModal = ({ isOpen, onClose, initialData }) => {
  const { updateService, loading } = useService();
  const { categories, fetchCategories } = useCategory();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    duration: '',
    currency: 'XAF',
    category: '',
    requiresStaff: true,
    status: 'draft',
    specialInstructions: '',
    cancellationPolicy: '',
    tags: '',
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        basePrice: initialData.basePrice || '',
        duration: initialData.duration || '',
        currency: initialData.currency || 'XAF',
        category: initialData.category?._id || initialData.category || '',
        requiresStaff: initialData.requiresStaff !== undefined ? initialData.requiresStaff : true,
        status: initialData.status || 'draft',
        specialInstructions: initialData.specialInstructions || '',
        cancellationPolicy: initialData.cancellationPolicy || '',
        tags: initialData.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags) : '',
      });
      setImage(null); // Reset image for new edit
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (file) => {
    setImage(file);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Service name is required";
    if (formData.name.trim().length < 2) newErrors.name = "Service name must be at least 2 characters";
    if (formData.name.trim().length > 100) newErrors.name = "Service name cannot exceed 100 characters";
    
    if (!formData.description.trim()) newErrors.description = "Service description is required";
    if (formData.description.trim().length < 10) newErrors.description = "Service description must be at least 10 characters";
    if (formData.description.trim().length > 1000) newErrors.description = "Service description cannot exceed 1000 characters";
    
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) newErrors.basePrice = "Valid base price is required";
    if (!formData.duration || parseInt(formData.duration) <= 0) newErrors.duration = "Valid duration is required";
    if (parseInt(formData.duration) > 480) newErrors.duration = "Duration cannot exceed 480 minutes (8 hours)";
    
    if (!formData.category) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      
      // Prepare data according to backend schema
      const serviceData = {
        name: formData.name,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        duration: parseInt(formData.duration),
        category: formData.category,
        requiresStaff: formData.requiresStaff,
        status: formData.status,
        specialInstructions: formData.specialInstructions || undefined,
        cancellationPolicy: formData.cancellationPolicy || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined,
        currency: formData.currency
      };

      // Add non-empty fields to FormData
      Object.keys(serviceData).forEach(key => {
        if (serviceData[key] !== undefined && serviceData[key] !== "") {
          if (key === 'tags' && Array.isArray(serviceData[key])) {
            serviceData[key].forEach(tag => formDataToSend.append('tags[]', tag));
          } else {
            formDataToSend.append(key, serviceData[key]);
          }
        }
      });

      if (image) {
        formDataToSend.append("serviceImage", image);
      }

      const success = await updateService(initialData._id, formDataToSend);
      
      if (success) {
        toast.success("Service updated successfully");
        handleClose();
      }
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      duration: '',
      currency: 'XAF',
      category: '',
      requiresStaff: true,
      status: 'draft',
      specialInstructions: '',
      cancellationPolicy: '',
      tags: '',
    });
    setImage(null);
    setErrors({});
    onClose();
  };

  const categoryOptions = categories?.map(cat => ({
    value: cat._id,
    label: cat.name
  })) || [];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Update Service</h2>
            <p className="text-sm text-gray-600 mt-1">Edit service details and settings</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Name */}
                <div className="md:col-span-2">
                  <Input
                    label="Service Name"
                    value={formData.name}
                    onChange={(value) => handleInputChange('name', value)}
                    placeholder="Enter service name"
                    error={errors.name}
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <TextArea
                    label="Description"
                    value={formData.description}
                    onChange={(value) => handleInputChange('description', value)}
                    placeholder="Describe the service"
                    error={errors.description}
                    required
                  />
                </div>

                {/* Base Price */}
                <div>
                  <Input
                    label={`Base Price (${formData.currency || 'XAF'})`}
                    type="number"
                    value={formData.basePrice}
                    onChange={(value) => handleInputChange('basePrice', value)}
                    placeholder="0"
                    error={errors.basePrice}
                    required
                  />
                </div>

                {/* Duration */}
                <div>
                  <Input
                    label="Duration (minutes)"
                    type="number"
                    value={formData.duration}
                    onChange={(value) => handleInputChange('duration', value)}
                    placeholder="60"
                    error={errors.duration}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <Select
                    label="Category"
                    options={categoryOptions}
                    value={formData.category}
                    onChange={(value) => handleInputChange('category', value)}
                    placeholder="Select category"
                    error={errors.category}
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <Select
                    label="Status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) => handleInputChange('status', value)}
                    placeholder="Select status"
                  />
                </div>

                {/* Requires Staff */}
                <div>
                  <Select
                    label="Requires Staff"
                    options={[
                      { value: true, label: "Yes" },
                      { value: false, label: "No" }
                    ]}
                    value={formData.requiresStaff}
                    onChange={(value) => handleInputChange('requiresStaff', value)}
                  />
                </div>

                {/* Special Instructions */}
                <div className="md:col-span-2">
                  <TextArea
                    label="Special Instructions (Optional)"
                    value={formData.specialInstructions}
                    onChange={(value) => handleInputChange('specialInstructions', value)}
                    placeholder="Any special instructions for this service"
                  />
                </div>

                {/* Cancellation Policy */}
                <div className="md:col-span-2">
                  <TextArea
                    label="Cancellation Policy (Optional)"
                    value={formData.cancellationPolicy}
                    onChange={(value) => handleInputChange('cancellationPolicy', value)}
                    placeholder="Cancellation policy for this service"
                  />
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <Input
                    label="Tags (Optional)"
                    value={formData.tags}
                    onChange={(value) => handleInputChange('tags', value)}
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Service Image
                    </label>
                    {initialData?.image && (
                      <div className="mb-2">
                        <img
                          src={initialData.image}
                          alt="Current service image"
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <p className="text-sm text-gray-500 mt-1">Current image</p>
                      </div>
                    )}
                    <FileUploader
                      onFileSelect={handleImageChange}
                      accept="image/*"
                      maxSize={5 * 1024 * 1024} // 5MB
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                <Button
                  type="submit"
                  additionalClasses="bg-accent text-white"
                  loading={loading}
                >
                  Update Service
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default UpdateServiceModal; 