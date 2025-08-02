import React from 'react';
import { Input, Select } from '../../../../ui';

const CallToActionStep = ({ formData, errors, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-700 mb-2">Call to Action</h4>
        <p className="text-xs text-blue-600">
          Add a call-to-action to encourage engagement with your post
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="CTA Text"
          value={formData.callToAction.text}
          onChange={(e) => onInputChange('callToAction', {
            ...formData.callToAction,
            text: e.target.value
          })}
          error={errors.callToAction?.text}
          placeholder="Book Now"
        />
        <Input
          label="CTA Link"
          value={formData.callToAction.link}
          onChange={(e) => onInputChange('callToAction', {
            ...formData.callToAction,
            link: e.target.value
          })}
          error={errors.callToAction?.link}
          placeholder="https://..."
        />
        <Select
          label="CTA Type"
          value={formData.callToAction.type}
          onChange={(e) => onInputChange('callToAction', {
            ...formData.callToAction,
            type: e.target.value
          })}
          error={errors.callToAction?.type}
        >
          <option value="booking">Booking</option>
          <option value="product">Product</option>
          <option value="contact">Contact</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="custom">Custom</option>
        </Select>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">CTA Examples</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Booking:</strong> "Book Now" → Booking page</p>
          <p><strong>Product:</strong> "Shop Now" → Product page</p>
          <p><strong>Contact:</strong> "Contact Us" → Contact form</p>
          <p><strong>WhatsApp:</strong> "Message Us" → WhatsApp chat</p>
        </div>
      </div>
    </div>
  );
};

export { CallToActionStep }; 