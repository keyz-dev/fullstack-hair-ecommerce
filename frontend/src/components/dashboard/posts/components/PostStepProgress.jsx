import React from 'react';
import { Check } from 'lucide-react';

const PostStepProgress = ({ steps, currentStep, isCurrentStepValid }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
                             <div
                 className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${
                   index < currentStep
                     ? 'bg-accent border-accent text-white'
                     : index === currentStep
                     ? isCurrentStepValid
                       ? 'bg-accent border-accent text-white'
                       : 'bg-accent/15 border-accent text-accent'
                     : 'bg-gray-100 border-gray-300 text-gray-500'
                 }`}
               >
                {index < currentStep ? (
                  <Check size={16} /> 
                ) : (
                  index + 1
                )}
              </div>
                             <div className="mt-2 text-center">
                 <p
                   className={`text-xs font-medium ${
                     index < currentStep 
                       ? 'text-primary' 
                       : index === currentStep
                       ? isCurrentStepValid
                         ? 'text-primary'
                         : 'text-yellow-600'
                       : 'text-gray-500'
                   }`}
                 >
                   {step.title}
                 </p>
               </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-accent' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { PostStepProgress }; 