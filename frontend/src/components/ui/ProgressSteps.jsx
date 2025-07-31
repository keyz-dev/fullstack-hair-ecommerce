import React from 'react';
import { Check } from 'lucide-react';

const ProgressSteps = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full mb-4">
      {/* Desktop/Tablet Layout */}
      <div className="hidden md:flex items-center justify-between">
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

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isClickable = onStepClick && (isCompleted || isCurrent);

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-accent border-accent text-white'
                      : isCurrent
                      ? 'bg-white border-accent text-accent'
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  } ${isClickable ? 'cursor-pointer hover:scale-110' : ''}`}
                  onClick={isClickable ? () => onStepClick(index) : undefined}
                >
                  {isCompleted ? (
                    <Check size={16} />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-medium transition-colors ${
                      isCompleted || isCurrent
                        ? 'text-accent'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-accent h-1 rounded-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`
            }}
          />
        </div>

        {/* Current Step Description */}
        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-accent">
            {steps[currentStep]?.label}
          </p>
          {steps[currentStep]?.description && (
            <p className="text-xs text-gray-500 mt-1">
              {steps[currentStep].description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps; 