import React from 'react';
import { Button } from '../../../ui';

const PostActionButtons = ({
  currentStep,
  totalSteps,
  loading,
  isNextDisabled,
  onPrevious,
  onNext,
  onCancel,
  onSubmit
}) => {
  return (
    <div className="flex justify-between items-center pt-4 mt-4 border-t">
      
      {currentStep > 0 ? (
        <Button
          type="button"
          text="Previous"
          additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          onClickHandler={onPrevious}
          disabled={loading}
        />
      ) : (
        <Button
          type="button"
          text="Cancel"
          additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          onClickHandler={onCancel}
          disabled={loading}
        />
      )}

      <div className="flex space-x-3">
        {currentStep < totalSteps - 1 ? (
          <Button
            type="button"
            text="Next"
            additionalClasses="primarybtn"
            onClickHandler={onNext}
            isDisabled={loading || isNextDisabled}
          />
        ) : (
          <Button
            type="submit"
            additionalClasses="primarybtn"
            onClickHandler={onSubmit}
            loading={loading}
            text="Create Post"
          />
        )}
      </div>
    </div>
  );
};

export { PostActionButtons }; 