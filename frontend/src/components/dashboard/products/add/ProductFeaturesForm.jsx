import React from 'react';
import { Input, TextArea } from '../../../ui';
import { Trash2 } from 'lucide-react';

const defaultFeature = { title: '', description: '', icon: '' };

const ProductFeaturesForm = ({ features, setFeatures }) => {
  const handleFeatureChange = (index, field, value) => {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  };

  const addFeature = () => setFeatures([...features, { ...defaultFeature }]);
  const removeFeature = (index) => setFeatures(features.filter((_, i) => i !== index));

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-primary">Key Features</h4>
        <button type="button" className="text-accent font-medium" onClick={addFeature}>+ Add Feature</button>
      </div>
      {features.length === 0 && <div className="text-gray-500 text-sm mb-2">No features added yet.</div>}
      {features.map((feature, idx) => (
        <div key={idx} className="mb-2">
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              name="title"
              placeholder="Feature title (e.g., Tangle-Free)"
              value={feature.title}
              onChangeHandler={e => handleFeatureChange(idx, 'title', e.target.value)}
              additionalClasses='border-line_clr'
            />
            <Input
              type="text"
              name="icon"
              placeholder="Icon (optional, e.g., fa-star)"
              value={feature.icon}
              onChangeHandler={e => handleFeatureChange(idx, 'icon', e.target.value)}
              additionalClasses='border-line_clr'
              required={false}
            />
            <button type="button" className="text-error hover:opacity-80" title='Remove Feature' onClick={() => removeFeature(idx)}>
              <Trash2 size={16} />
            </button>
          </div>
          <TextArea
            name="description"
            placeholder="Feature description (optional)"
            value={feature.description}
            onChangeHandler={e => handleFeatureChange(idx, 'description', e.target.value)}
            additionalClasses='border-line_clr'
          />
        </div>
      ))}
    </div>
  );
};

export default ProductFeaturesForm; 