import React from 'react';
import BasicInfoStep from './steps/BasicInfoStep';
import ConfigurationStep from './steps/ConfigurationStep';
import AdditionalDetailsStep from './steps/AdditionalDetailsStep';
import MediaStep from './steps/MediaStep';

const ServiceFormRenderer = ({
  currentStep,
  formData,
  image,
  errors,
  categories,
  onInputChange,
  onImageChange
}) => {
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            errors={errors}
            onInputChange={onInputChange}
          />
        );
      case 1:
        return (
          <ConfigurationStep
            formData={formData}
            errors={errors}
            categories={categories}
            onInputChange={onInputChange}
          />
        );
      case 2:
        return (
          <AdditionalDetailsStep
            formData={formData}
            onInputChange={onInputChange}
          />
        );
      case 3:
        return (
          <MediaStep
            image={image}
            onImageChange={onImageChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="">
        {renderStep()}
    </div>
  );
};

export default ServiceFormRenderer; 