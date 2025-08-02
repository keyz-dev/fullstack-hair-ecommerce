import React from 'react';
import { Button } from '../../../ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ServiceActionButtons = ({
  currentStep,
  totalSteps,
  loading,
  onPrevious,
  onNext,
  onCancel,
  onSubmit
}) => {
  return (
    <div className="flex justify-between items-center pt-6 border-t mt-8">
      <div>
        {currentStep > 0 && (
          <Button
            onClickHandler={onPrevious}
            additionalClasses="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>
        )}
      </div>
      
      <div className="flex gap-3">        
        {currentStep < totalSteps - 1 ? (
          <Button
            onClickHandler={onNext}
            additionalClasses="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Next
            <ChevronRight size={16} />
          </Button>
        ) : (
          <Button
            onClickHandler={onSubmit}
            additionalClasses="bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            loading={loading}
            isDisabled={loading}
          >
            {loading ? 'Creating Service...' : 'Create Service'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceActionButtons; 