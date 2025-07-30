import React from 'react';

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
        <h4 className="font-semibold text-gray-900">Key Features</h4>
        <button type="button" className="text-accent font-medium" onClick={addFeature}>+ Add Feature</button>
      </div>
      {features.length === 0 && <div className="text-gray-500 text-sm mb-2">No features added yet.</div>}
      {features.map((feature, idx) => (
        <div key={idx} className="border rounded-lg p-3 mb-3 bg-gray-50">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              placeholder="Feature title (e.g., Tangle-Free)"
              value={feature.title}
              onChange={e => handleFeatureChange(idx, 'title', e.target.value)}
            />
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              placeholder="Icon (optional, e.g., fa-star)"
              value={feature.icon}
              onChange={e => handleFeatureChange(idx, 'icon', e.target.value)}
            />
            <button type="button" className="text-red-500 ml-2" onClick={() => removeFeature(idx)}>
              Remove
            </button>
          </div>
          <textarea
            className="border rounded px-2 py-1 w-full"
            placeholder="Feature description (optional)"
            value={feature.description}
            onChange={e => handleFeatureChange(idx, 'description', e.target.value)}
            rows={2}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductFeaturesForm; 