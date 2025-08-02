import React, { useState } from 'react';
import { FileUploader } from '../../../../ui';
import { Image, X } from 'lucide-react';

const MediaStep = ({ onImageChange }) => {

  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (file) => {
    onImageChange(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Image Upload */}
        <div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <label className="block text-sm font-medium text-gray-700">
                Service Image
              </label>
            </div>
            
            <FileUploader
              preview={imagePreview}
              onChange={handleImageChange}
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              additionalClasses="mt-4"
              text={" PNG, JPG, GIF up to 5MB"}
            />
          </div>
        </div>
      </div>

      {/* Collapsible Image Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg mt-6">
        <button
          type="button"
          className="w-full flex items-center justify-between p-4 focus:outline-none"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <summary className="flex items-center cursor-pointer outline-none select-none">
            <Image className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium text-yellow-900 mb-1">
              Image Guidelines
            </span>
            <span className="ml-2 text-yellow-700 text-xs group-open:rotate-90 transition-transform">&#9654;</span>
          </summary>
          <svg
            className={`h-4 w-4 text-blue-500 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 20 20"
          >
            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {open && (
          <div className="px-4 pb-4">
                    <ul className="text-xs text-yellow-700 space-y-1 mt-2 ml-8">
          <li>• Use high-quality images that clearly show your service</li>
          <li>• Recommended size: 800x600 pixels or larger</li>
          <li>• Supported formats: PNG, JPG, GIF</li>
          <li>• Maximum file size: 5MB</li>
        </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaStep; 