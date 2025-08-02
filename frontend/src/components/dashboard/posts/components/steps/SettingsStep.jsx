import React from 'react';
import { Input, Select } from '../../../../ui';

const SettingsStep = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => onInputChange('status', e.target.value)}
          error={errors.status}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </Select>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => onInputChange('featured', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Featured Post
          </label>
        </div>

        <Input
          type="datetime-local"
          label="Schedule For"
          value={formData.scheduledFor}
          onChange={(e) => onInputChange('scheduledFor', e.target.value)}
          error={errors.scheduledFor}
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Sharing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="facebook"
              checked={formData.socialShare.facebook}
              onChange={(e) => onInputChange('socialShare', {
                ...formData.socialShare,
                facebook: e.target.checked
              })}
              className="mr-2"
            />
            <label htmlFor="facebook" className="text-sm font-medium text-gray-700">
              Share on Facebook
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="instagram"
              checked={formData.socialShare.instagram}
              onChange={(e) => onInputChange('socialShare', {
                ...formData.socialShare,
                instagram: e.target.checked
              })}
              className="mr-2"
            />
            <label htmlFor="instagram" className="text-sm font-medium text-gray-700">
              Share on Instagram
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="whatsapp"
              checked={formData.socialShare.whatsapp}
              onChange={(e) => onInputChange('socialShare', {
                ...formData.socialShare,
                whatsapp: e.target.checked
              })}
              className="mr-2"
            />
            <label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">
              Share on WhatsApp
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SettingsStep }; 