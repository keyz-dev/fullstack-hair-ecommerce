import React from 'react';
import { Input } from '../../../ui';
import { X, Plus, Minus, Trash2 } from 'lucide-react';

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
        <h4 className="font-semibold text-primary">Variants</h4>
        <button type="button" className="text-accent font-medium flex items-center justify-center gap-1" onClick={addVariant}><Plus size={16} /> Add Variant</button>
      </div>
      {variants.length === 0 && <div className="text-gray-500 text-sm mb-2">No variants added yet.</div>}
      {variants.map((variant, vIdx) => (
        <div key={vIdx} className="mb-2">
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              name="name"
              label="Variant name"
              placeholder="Variant name (e.g., Length, Color)"
              value={variant.name}
              onChangeHandler={e => handleVariantChange(vIdx, 'name', e.target.value)}
              additionalClasses='border-line_clr'
              labelClasses='text-sm text-secondary'
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
                <Input
                  type="text"
                  name={`option-${vIdx}-${oIdx}`}
                  placeholder="Option (e.g., 10, Blonde)"
                  value={option}
                  onChangeHandler={e => handleOptionChange(vIdx, oIdx, e.target.value)}
                  additionalClasses='border-line_clr'
                />
                <button type="button" className="text-error  hover:opacity-80" title='Remove Option' onClick={() => removeOption(vIdx, oIdx)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button type="button" className="text-accent text-xs" title='Add Option' onClick={() => addOption(vIdx)}>
              <Plus size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductVariantsForm; 