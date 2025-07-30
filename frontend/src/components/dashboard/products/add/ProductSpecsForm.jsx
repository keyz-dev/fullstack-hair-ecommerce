import React from 'react';
import { Input } from '../../../ui';

const specFields = [
  { label: 'length', placeholder: 'e.g., Short, Medium, Long' },
  { label: 'texture', placeholder: 'e.g., Straight, Wavy, Curly' },
  { label: 'material', placeholder: 'e.g., Human Hair, Synthetic' },
  { label: 'weight', placeholder: 'e.g., 100g, 150g' },
  { label: 'density', placeholder: 'e.g., Light, Medium, Heavy' },
  { label: 'capSize', placeholder: 'e.g., Small, Medium, Large' },
  { label: 'hairType', placeholder: 'e.g., Virgin, Remy' },
  { label: 'origin', placeholder: 'e.g., Brazilian, Peruvian' },
  { label: 'careInstructions', placeholder: 'e.g., Wash, Dry, Style' },
  { label: 'warranty', placeholder: 'e.g., 1 Year, 2 Years' },
];

const ProductSpecsForm = ({ specs, setSpecs }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedSpecs = { ...specs, [name]: value };
    setSpecs(updatedSpecs);
  };

  return (
    <div className="mb-4">
      <h4 className="font-semibold text-primary mb-2">Specifications</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {specFields.map(field => (
          <div key={field.label}>
            <Input
              type="text"
              label={field.label.charAt(0).toUpperCase() + field.label.slice(1)}
              name={field.label}
              value={specs[field.label]}
              onChangeHandler={handleChange}
              placeholder={field.placeholder}
              additionalClasses='border-line_clr'
              labelClasses='text-sm text-secondary'
              required={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecsForm; 