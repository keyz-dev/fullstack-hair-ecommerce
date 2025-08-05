import React, { useState, useEffect } from "react";
import { useProducts, useCategory, useImageManager } from "../../../hooks";
import {
  ModalWrapper,
  FormHeader,
  ProgressSteps
} from "../../ui";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { BasicInfoStep, ImagesStep, SpecificationsStep } from "./update";

const UpdateProductModal = ({ isOpen, onClose, initialData }) => {
  const { updateProduct, loading } = useProducts();
  const { categories } = useCategory();
  const [step, setStep] = useState(1);

  const initialFormData = {
    name: "",
    description: "",
    price: "",
    discount: 0,
    stock: "",
    category: "",
    currency: "",
    isActive: true,
    isFeatured: false,
    isOnSale: false,
    variants: [],
    specifications: {
      length: '',
      texture: '',
      material: '',
      weight: '',
      density: '',
      capSize: '',
      hairType: '',
      origin: '',
      careInstructions: '',
      warranty: ''
    },
    features: [],
    tags: [],
    metaTitle: '',
    metaDescription: ''
  }
  
  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [newVariant, setNewVariant] = useState({ name: '', options: [], required: false });
  const [newFeature, setNewFeature] = useState({ title: '', description: '', icon: '' });

  const {
    existingImages,
    newImages,
    addImages,
    removeExistingImage,
    removeNewImage,
    getFormData: getImageFormData,
    hasChanges: hasImageChanges,
  } = useImageManager(initialData?.images);

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  const steps = [
    {
      label: "Basic Info",
      description: "Product details & pricing"
    },
    {
      label: "Images",
      description: "Manage product images"
    },
    {
      label: "Specifications",
      description: "Product specs & features"
    }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        discount: initialData.discount || 0,
        stock: initialData.stock || "",
        currency: initialData.currency || "XAF", // Fix: currency is already a string code
        category: initialData.category?._id || initialData.category || "",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        isFeatured: initialData.isFeatured || false,
        isOnSale: initialData.isOnSale || false,
        variants: initialData.variants || [],
        specifications: initialData.specifications || initialFormData.specifications,
        features: initialData.features || [],
        tags: initialData.tags || [],
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSpecificationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addVariant = () => {
    if (newVariant.name.trim() && newVariant.options.length > 0) {
      setFormData(prev => ({
        ...prev,
        variants: [...prev.variants, { ...newVariant }]
      }));
      setNewVariant({ name: '', options: [], required: false });
    }
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (newFeature.title.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, { ...newFeature }]
      }));
      setNewFeature({ title: '', description: '', icon: '' });
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.stock) newErrors.stock = "Stock is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.description) newErrors.description = "Description is required.";

    // Check if any field is actually changed compared to initialData
    const isChanged =
      formData.name !== (initialData?.name || "") ||
      formData.description !== (initialData?.description || "") ||
      String(formData.price) !== String(initialData?.price || "") ||
      String(formData.discount) !== String(initialData?.discount || 0) ||
      String(formData.stock) !== String(initialData?.stock || "") ||
      (typeof formData.category === "object"
        ? formData.category?._id !== (initialData?.category?._id || initialData?.category || "")
        : formData.category !== (initialData?.category?._id || initialData?.category || "")) ||
      formData.isActive !== initialData?.isActive ||
      formData.isFeatured !== initialData?.isFeatured ||
      formData.isOnSale !== initialData?.isOnSale ||
      JSON.stringify(formData.variants) !== JSON.stringify(initialData?.variants || []) ||
      JSON.stringify(formData.specifications) !== JSON.stringify(initialData?.specifications || {}) ||
      JSON.stringify(formData.features) !== JSON.stringify(initialData?.features || []) ||
      JSON.stringify(formData.tags) !== JSON.stringify(initialData?.tags || []) ||
      formData.metaTitle !== (initialData?.metaTitle || "") ||
      formData.metaDescription !== (initialData?.metaDescription || "") ||
      hasImageChanges(initialData?.images);

    if (!isChanged) {
      newErrors.form = "No changes detected. Please update at least one field.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const data = new FormData();
    
    // Add form fields
    Object.entries(formData).forEach(([key, value]) => {
      // Handle category field properly
      if (key === 'category' && typeof value === 'object' && value._id) {
        data.append(key, value._id);
      } else if (key === 'variants' || key === 'specifications' || key === 'features') {
        // Convert arrays and objects to JSON strings
        data.append(key, JSON.stringify(value));
      } else if (key === 'tags') {
        // Convert tags array to comma-separated string
        data.append(key, value.join(','));
      } else {
        data.append(key, value);
      }
    });

    // Add image data from useImageManager
    const imageData = getImageFormData();
    for (let [key, value] of imageData.entries()) {
      data.append(key, value);
    }

    const result = await updateProduct(initialData._id, data);
    if (result) {
      toast.success("Product updated successfully");
      // reset the form
      setFormData(initialFormData);
      setNewTag('');
      setNewVariant({ name: '', options: [], required: false });
      setNewFeature({ title: '', description: '', icon: '' });
      setErrors({});
      onClose();
    }
  };

  const handleStepClick = (stepIndex) => {
    // Only allow going back to completed steps
    if (stepIndex < step) {
      setStep(stepIndex + 1);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setNewTag('');
    setNewVariant({ name: '', options: [], required: false });
    setNewFeature({ title: '', description: '', icon: '' });
    setErrors({});
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Update Product</h2>
            <p className="text-sm text-gray-600 mt-1">Edit product details and settings</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-4">
          <ProgressSteps 
            steps={steps} 
            currentStep={step - 1} 
            onStepClick={handleStepClick}
          />
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="p-6">
            {/* Step Content */}
            {step === 1 && (
              <BasicInfoStep
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                categoryOptions={categoryOptions}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <ImagesStep
                existingImages={existingImages}
                newImages={newImages}
                onRemoveExisting={removeExistingImage}
                onRemoveNew={removeNewImage}
                onAddImages={addImages}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <SpecificationsStep
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleSpecificationChange={handleSpecificationChange}
                newTag={newTag}
                setNewTag={setNewTag}
                addTag={addTag} 
                removeTag={removeTag}
                newFeature={newFeature}
                setNewFeature={setNewFeature}
                addFeature={addFeature}
                removeFeature={removeFeature}
                onBack={() => setStep(2)}
                onSubmit={handleUpdate}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default UpdateProductModal;
