import React from 'react';
import { User, Truck, CreditCard, Check } from 'lucide-react';

const CheckoutProgress = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Customer Info', icon: User },
    { number: 2, title: 'Shipping', icon: Truck },
    { number: 3, title: 'Payment', icon: CreditCard },
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;
        
        return (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
              isCompleted
                ? 'bg-green-500 border-green-500 text-white'
                : isActive
                ? 'bg-primary border-primary text-white'
                : 'bg-gray-100 border-gray-300 text-gray-500'
            }`}>
              {isCompleted ? (
                <Check size={20} />
              ) : (
                <Icon size={20} />
              )}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              isActive ? 'text-primary' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                isCompleted ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutProgress; 