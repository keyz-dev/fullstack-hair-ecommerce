import React from 'react';
import { Textarea, TagInput } from '../../../../ui';

const ContentStep = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-6">
      <Textarea
        label="Content"
        value={formData.content}
        onChangeHandler={(e) => onInputChange('content', e.target.value)}
        rows={5}
        error={errors.content}
        required
        placeholder="Write your post content here..."
      />

      <Textarea
        label="Excerpt"
        value={formData.excerpt}
        onChangeHandler={(e) => onInputChange('excerpt', e.target.value)}
        rows={3}
        error={errors.excerpt}
        placeholder="Brief summary of the post..."
      />

      <TagInput
        label="Tags"
        value={formData.tags}
        onChangeHandler={(tags) => onInputChange('tags', tags)}
        error={errors.tags}
        placeholder="Add tags..."
      />
    </div>
  );
};

export { ContentStep }; 