import React from 'react';
import { Input, TextArea, PriceInput } from '../../../../ui';
import { Tag } from 'lucide-react';

const BasicInfoStep = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Name */}
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag className="h-5 w-5 text-gray-400" />
            </div>
                          <Input
                label="Service Name"
                value={formData.name}
                onChangeHandler={(e) => onInputChange("name", e.target.value)}
                placeholder="Enter service name"
                error={errors.name}
                required
                additionalClasses="border-line_clr"
              />
          </div>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
            <TextArea
              label="Description"
              value={formData.description}
              onChangeHandler={(e) => onInputChange("description", e.target.value)}
              placeholder="Describe the service in detail"
              error={errors.description}
              required
              additionalClasses="border-line_clr"
              rows={4}
            />
        </div>

        {/* Base Price */}
        <PriceInput
          label="Base Price"
          price={formData.basePrice}
          onPriceChange={(e) => onInputChange("basePrice", e.target.value)}
          currency={formData.currency} 
          onCurrencyChange={(value) => onInputChange("currency", value)}
          showLabel={true}
          error={errors.basePrice}
          required
        />

        {/* Duration */}
        <Input
          label="Duration (minutes)"
          type="number"
          value={formData.duration}
          onChangeHandler={(e) => onInputChange("duration", e.target.value)}
          placeholder="60"
          error={errors.duration}
          required
          additionalClasses="border-line_clr"
        />
      </div>
    </div>
  );
};

export default BasicInfoStep; 