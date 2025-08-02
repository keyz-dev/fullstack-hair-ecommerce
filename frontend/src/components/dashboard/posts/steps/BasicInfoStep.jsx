import React, { useState } from 'react';
import { Button, Input, Textarea } from '../../../ui';
import { 
  Palette, 
  BookOpen, 
  Star, 
  Lightbulb, 
  Zap, 
  Camera, 
  TrendingUp 
} from 'lucide-react';

const BasicInfoStep = ({ 
  title = '', 
  description = '', 
  postType = 'work-showcase', 
  onSave, 
  onBack, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    title,
    description,
    postType
  });
  const [errors, setErrors] = useState({});

  const postTypes = [
    {
      id: 'work-showcase',
      title: 'Work Showcase',
      description: 'Before/after transformations',
      icon: Camera,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: 'tutorial',
      title: 'Tutorial',
      description: 'Step-by-step how-to guides',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'product-review',
      title: 'Product Review',
      description: 'Product recommendations',
      icon: Star,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
    {
      id: 'styling-tip',
      title: 'Styling Tip',
      description: 'Quick tips and advice',
      icon: Lightbulb,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'transformation',
      title: 'Transformation',
      description: 'Dramatic hair changes',
      icon: Zap,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      id: 'technique-demo',
      title: 'Technique Demo',
      description: 'Show specific techniques',
      icon: TrendingUp,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      id: 'promotion',
      title: 'Promotion',
      description: 'Business promotions',
      icon: Palette,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 150) {
      newErrors.title = 'Title cannot exceed 150 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 1500) {
      newErrors.description = 'Description cannot exceed 1500 characters';
    }

    if (!formData.postType) {
      newErrors.postType = 'Please select a post type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Basic Information
        </h2>
        <p className="text-gray-600">
          Add a title, select your post type, and write a description
        </p>
      </div>

      <div className="space-y-6">
        {/* Title Input */}
        <div>
          <Input
            name="title"
            id="title"
            label="Title"
            required={true}
            type="text"
            value={formData.title}
            onChangeHandler={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter a compelling title for your post..."
            error={errors.title}
            additionalClasses='border-line_clr'
            maxLength={150}
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.title.length}/150 characters
          </p>
        </div>

        {/* Post Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Post Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {postTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => handleInputChange('postType', type.id)}
                  className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                    formData.postType === type.id ? 'ring-2 ring-accent bg-accent/5 ' : 'ring ring-line_clr'
                }`}
              >
                <div className={`h-full rounded-xs p-4 transition-all duration-300`}>
                  <div className="flex flex-col items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center`}>
                      <type.icon className={`w-5 h-5 ${type.iconColor} text-white`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary text-center">{type.title}</h3>
                      <p className="text-xs text-gray-600 text-center">{type.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.postType && (
            <p className="mt-2 text-sm text-red-600">{errors.postType}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <Textarea
            name="description"
            id="description"
            label="Description"
            required={true}
            value={formData.description}
            onChangeHandler={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your post content, what viewers can expect, or any important details..."
            rows={6}
            error={errors.description}
            additionalClasses='border-line_clr'
            maxLength={1500}
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/1500 characters
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            onClickHandler={onBack}
            additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
            leadingIcon={"fas fa-arrow-left"}
          >
            Back
          </Button>
          <Button
            onClickHandler={handleSubmit}
            additionalClasses="bg-accent text-white hover:bg-accent/90"
            isLoading={loading}
            isDisabled={loading}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep; 