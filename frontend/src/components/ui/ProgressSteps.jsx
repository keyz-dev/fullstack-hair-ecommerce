import React from 'react';
import { Check } from 'lucide-react';

const ProgressSteps = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && (isCompleted || isCurrent);

          return (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-accent border-accent text-white'
                    : isCurrent
                    ? 'bg-white border-accent text-accent'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                } ${isClickable ? 'cursor-pointer hover:scale-110' : ''}`}
                onClick={isClickable ? () => onStepClick(index) : undefined}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="ml-3">
                <p
                  className={`text-sm font-medium transition-colors ${
                    isCompleted || isCurrent
                      ? 'text-accent'
                      : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-400 mt-1">
                    {step.description}
                  </p>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-colors ${
                    isCompleted ? 'bg-accent' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps; 