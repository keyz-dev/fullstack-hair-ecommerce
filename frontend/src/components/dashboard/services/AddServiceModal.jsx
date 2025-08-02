import React, { useState, useEffect } from 'react';
import { ModalWrapper, Button } from '../../ui';
import { useService } from '../../../hooks';
import { useCategory } from '../../../hooks';
import { X } from 'lucide-react';
import { 
  ServiceStepProgress, 
  ServiceFormRenderer, 
  ServiceActionButtons 
} from './components';

const AddServiceModal = ({ isOpen, onClose }) => {
  const { createService, loading } = useService();
  const { categories, fetchCategories } = useCategory();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    duration: "",
    currency: "XAF",
    category: "",
    requiresStaff: true,
    status: "draft",
    specialInstructions: "",
    cancellationPolicy: "",
    tags: "",
  });

  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const steps = [
    { title: "Basic Information", description: "Details & pricing" },
    { title: "Configuration", description: "Category & staff" },
    { title: "Additional Details", description: "Instructions & tags" },
    { title: "Media", description: "Images" }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setCurrentStep(0);
    }
  }, [isOpen, fetchCategories]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (file) => {
    setImage(file);
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 0:
        if (!formData.name.trim()) newErrors.name = "Service name is required";
        if (formData.name.trim().length < 2) newErrors.name = "Service name must be at least 2 characters";
        if (formData.name.trim().length > 100) newErrors.name = "Service name cannot exceed 100 characters";
        
        if (!formData.description.trim()) newErrors.description = "Service description is required";
        if (formData.description.trim().length < 10) newErrors.description = "Service description must be at least 10 characters";
        if (formData.description.trim().length > 1000) newErrors.description = "Service description cannot exceed 1000 characters";
        
        if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) newErrors.basePrice = "Valid base price is required";
        if (!formData.duration || parseInt(formData.duration) <= 0) newErrors.duration = "Valid duration is required";
        if (parseInt(formData.duration) > 480) newErrors.duration = "Duration cannot exceed 480 minutes (8 hours)";
        break;
      case 1:
        if (!formData.category) newErrors.category = "Category is required";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

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
         // Add currency field
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

             const success = await createService(formDataToSend);
       
       if (success) {
         handleClose();
       }
     } catch (error) {
       console.error("Error creating service:", error);
       // Error is already handled by the context and shown in toast
     }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      basePrice: "",
      duration: "",
      currency: "XAF",
      category: "",
      requiresStaff: true,
      status: "draft",
      specialInstructions: "",
      cancellationPolicy: "",
      tags: "",
    });
    setImage(null);
    setErrors({});
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-2 lg:p-6 w-full max-w-2xl relative overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center justify-center flex-col">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Add New Service
          </h2>
          <p className="text-gray-600">
            Create a new service for your salon
          </p>
        </div>

        {/* Progress Steps */}
        <ServiceStepProgress 
          steps={steps} 
          currentStep={currentStep} 
        />

        {/* Form Content */}
        <ServiceFormRenderer
          currentStep={currentStep}
          formData={formData}
          image={image}
          errors={errors}
          categories={categories}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
        />

        {/* Action Buttons */}
        <ServiceActionButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          loading={loading}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onCancel={handleClose}
          onSubmit={handleSubmit}
        />
      </div>
    </ModalWrapper>
  );
};

export default AddServiceModal; 