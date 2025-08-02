import React from 'react';
import { Input, Select } from '../../../../ui';

const BasicInfoStep = ({ formData, errors, onInputChange }) => {

  const postTypes = [
    { label: 'Post', value: 'post' },
    { label: 'Story', value: 'story' },
    { label: 'Reel', value: 'reel' },
    { label: 'Transformation', value: 'transformation' },
    { label: 'Tutorial', value: 'tutorial' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Title"
          value={formData.title}
          onChangeHandler={(e) => onInputChange('title', e.target.value)}
          error={errors.title}
          required
        />
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => onInputChange('type', e.target.value)}
          error={errors.type}
          options={postTypes || []}
          required
        />
      </div>

      <Input
        label="Meta Title"
        value={formData.metaTitle}
        onChangeHandler={(e) => onInputChange('metaTitle', e.target.value)}
        error={errors.metaTitle}
        placeholder="SEO title for search engines..."
        required={false}
      />

      <Input
        label="Meta Description"
        value={formData.metaDescription}
        onChangeHandler={(e) => onInputChange('metaDescription', e.target.value)}
        error={errors.metaDescription}
        placeholder="Brief description for search engines..."
        required={false}
      />
    </div>
  );
};

export { BasicInfoStep }; 