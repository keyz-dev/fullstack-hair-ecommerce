import React from 'react';

const specFields = [
  { name: 'length', label: 'Length (e.g., Short, Medium, Long)' },
  { name: 'texture', label: 'Texture (e.g., Straight, Wavy, Curly)' },
  { name: 'material', label: 'Material (e.g., Human Hair, Synthetic)' },
  { name: 'weight', label: 'Weight (e.g., 100g, 150g)' },
  { name: 'density', label: 'Density (e.g., Light, Medium, Heavy)' },
  { name: 'capSize', label: 'Cap Size (e.g., Small, Medium, Large)' },
  { name: 'hairType', label: 'Hair Type (e.g., Virgin, Remy)' },
  { name: 'origin', label: 'Origin (e.g., Brazilian, Peruvian)' },
  { name: 'careInstructions', label: 'Care Instructions' },
  { name: 'warranty', label: 'Warranty' },
];

const ProductSpecsForm = ({ specs, setSpecs }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpecs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-4">
      <h4 className="font-semibold text-gray-900 mb-2">Specifications</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {specFields.map(field => (
          <div key={field.name}>
            <label className="block text-xs font-medium text-gray-700 mb-1">{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={specs[field.name] || ''}
              onChange={handleChange}
              className="border rounded px-2 py-1 w-full"
              placeholder={field.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecsForm; 