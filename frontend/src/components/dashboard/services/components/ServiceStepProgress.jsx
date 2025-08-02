import React from 'react';
import { Check } from 'lucide-react';

const ServiceStepProgress = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1 justify-center">
            <div className="flex items-center flex-col justify-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                index < currentStep 
                  ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                  : index === currentStep
                  ? 'bg-accent border-accent text-white shadow-lg scale-110' 
                  : 'border-gray-300 text-gray-500 bg-white'
              }`}>
                {index < currentStep ? (
                  <Check size={16} className="text-white" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              <div className="ml-3 flex-1">
                <p className={`text-sm text-center font-semibold transition-colors duration-300 ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${
                index < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceStepProgress; 