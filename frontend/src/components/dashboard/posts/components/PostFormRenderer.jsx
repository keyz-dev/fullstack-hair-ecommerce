import React from 'react';
import {
  BasicInfoStep,
  ContentStep,
  MediaStep,
  SettingsStep,
  CallToActionStep
} from './steps';

const PostFormRenderer = ({
  currentStep,
  formData,
  errors,
  onInputChange,
  isCurrentStepValid
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
          <ContentStep
            formData={formData}
            errors={errors}
            onInputChange={onInputChange}
          />
        );
      case 2:
        return (
          <MediaStep
            formData={formData}
            errors={errors}
            onInputChange={onInputChange}
          />
        );
      case 3:
        return (
          <SettingsStep
            formData={formData}
            errors={errors}
            onInputChange={onInputChange}
          />
        );
      case 4:
        return (
          <CallToActionStep
            formData={formData}
            errors={errors}
            onInputChange={onInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderStep()}
      
      {/* Validation Message */}
      {!isCurrentStepValid && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-700">
            Please complete all required fields before proceeding to the next step.
          </p>
        </div>
      )}
    </div>
  );
};

export { PostFormRenderer }; 