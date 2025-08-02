import React, { useState, useEffect } from 'react';
import { ModalWrapper } from '../../ui';
import { usePost } from '../../../hooks';
import { X } from 'lucide-react';
import { 
  PostStepProgress, 
  PostFormRenderer, 
  PostActionButtons 
} from './components';

const CreatePostModal = ({ isOpen, onClose }) => {
  const { createPost, loading } = usePost();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    type: '',
    status: 'draft',
    featured: false,
    tags: [],
    categories: [],
    services: [],
    products: [],
    callToAction: {
      text: '',
      link: '',
      type: 'booking'
    },
    metaTitle: '',
    metaDescription: '',
    scheduledFor: '',
    socialShare: {
      facebook: false,
      instagram: false,
      whatsapp: false
    },
    images: [],
    videos: [],
    imageAlts: [],
    imageCaptions: [],
    videoCaptions: []
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { title: "Basic Info" },
    { title: "Content" },
    { title: "Media" },
    { title: "Settings" },
    { title: "CTA" }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {  
      case 0:
        if (!formData.title.trim()) newErrors.title = "Post title is required";
        if (formData.title.trim().length < 3) newErrors.title = "Title must be at least 3 characters";
        if (formData.title.trim().length > 100) newErrors.title = "Title cannot exceed 100 characters";
        if (!formData.type.trim()) newErrors.type = "Post type is required";
        break;
      case 1:
        if (!formData.content.trim()) newErrors.content = "Post content is required";
        if (formData.content.trim().length < 10) newErrors.content = "Content must be at least 10 characters";
        break;
      case 2:
        // Media is optional, no validation needed
        break;
      case 3:
        // Settings are optional, no validation needed
        break;
      case 4:
        // CTA is optional, no validation needed
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.title.trim().length >= 3 && 
               formData.title.trim().length <= 100 && 
               formData.type.trim() !== '';
      case 1:
        return formData.content.trim().length >= 10;
      case 2:
        // Media is optional, but if user has started adding media, validate it
        if (formData.images.length > 0 || formData.videos.length > 0) {
          // If they have media, ensure alt texts are provided for images
          const hasValidImageAlts = formData.images.every((_, index) => 
            formData.imageAlts?.[index]?.trim() || true // Allow empty alt text
          );
          return hasValidImageAlts;
        }
        return true; // No media is fine
      case 3:
        // Settings are optional, always valid
        return true;
      case 4:
        // CTA is optional, but if they start filling it, validate it
        if (formData.callToAction.text.trim() || formData.callToAction.link.trim()) {
          return formData.callToAction.text.trim() && formData.callToAction.link.trim();
        }
        return true; // No CTA is fine
      default:
        return false;
    }
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
      const result = await createPost(formData);
      if (result) {
        handleClose();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      // Error is already handled by the context and shown in toast
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      type: '',
      status: 'draft',
      featured: false,
      tags: [],
      categories: [],
      services: [],
      products: [],
      callToAction: {
        text: '',
        link: '',
        type: 'booking'
      },
      metaTitle: '',
      metaDescription: '',
      scheduledFor: '',
      socialShare: {
        facebook: false,
        instagram: false,
        whatsapp: false
      },
      images: [],
      videos: [],
      imageAlts: [],
      imageCaptions: [],
      videoCaptions: []
    });
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
            Create New Post
          </h2>
          <p className="text-gray-600">
            Share your content with your audience
          </p>
        </div>

        {/* Progress Steps */}
        <PostStepProgress 
          steps={steps} 
          currentStep={currentStep}
          isCurrentStepValid={isCurrentStepValid()}
        />

        {/* Form Content */}
        <PostFormRenderer
          currentStep={currentStep}
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          isCurrentStepValid={isCurrentStepValid()}
        />

        {/* Action Buttons */}
        <PostActionButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          loading={loading}
          isNextDisabled={!isCurrentStepValid()}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onCancel={handleClose}
          onSubmit={handleSubmit}
        />
      </div>
    </ModalWrapper>
  );
};

export default CreatePostModal; 