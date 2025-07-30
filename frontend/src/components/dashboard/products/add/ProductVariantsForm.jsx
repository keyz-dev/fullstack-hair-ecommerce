import React from 'react';

const defaultVariant = { name: '', options: [''], required: false };

const ProductVariantsForm = ({ variants, setVariants }) => {
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleOptionChange = (variantIndex, optionIndex, value) => {
    const updated = [...variants];
    updated[variantIndex].options[optionIndex] = value;
    setVariants(updated);
  };

  const addVariant = () => setVariants([...variants, { ...defaultVariant }]);
  const removeVariant = (index) => setVariants(variants.filter((_, i) => i !== index));

  const addOption = (variantIndex) => {
    const updated = [...variants];
    updated[variantIndex].options.push('');
    setVariants(updated);
  };
  const removeOption = (variantIndex, optionIndex) => {
    const updated = [...variants];
    updated[variantIndex].options = updated[variantIndex].options.filter((_, i) => i !== optionIndex);
    setVariants(updated);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900">Variants</h4>
        <button type="button" className="text-accent font-medium" onClick={addVariant}>+ Add Variant</button>
      </div>
      {variants.length === 0 && <div className="text-gray-500 text-sm mb-2">No variants added yet.</div>}
      {variants.map((variant, vIdx) => (
        <div key={vIdx} className="border rounded-lg p-3 mb-3 bg-gray-50">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              placeholder="Variant name (e.g., Length, Color)"
              value={variant.name}
              onChange={e => handleVariantChange(vIdx, 'name', e.target.value)}
            />
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={variant.required}
                onChange={e => handleVariantChange(vIdx, 'required', e.target.checked)}
              />
              Required
            </label>
            <button type="button" className="text-red-500 ml-2" onClick={() => removeVariant(vIdx)}>
              Remove
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option, oIdx) => (
              <div key={oIdx} className="flex items-center gap-1 mb-1">
                <input
                  type="text"
                  className="border rounded px-2 py-1"
                  placeholder="Option (e.g., 10, Blonde)"
                  value={option}
                  onChange={e => handleOptionChange(vIdx, oIdx, e.target.value)}
                />
                <button type="button" className="text-red-400" onClick={() => removeOption(vIdx, oIdx)}>
                  ×
                </button>
              </div>
            ))}
            <button type="button" className="text-accent text-xs" onClick={() => addOption(vIdx)}>
              + Add Option
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariantsForm; 