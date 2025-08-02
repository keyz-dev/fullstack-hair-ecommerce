import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ 
  label, 
  value = [], 
  onChange, 
  multiple = false,
  maxFiles = 10,
  accept = "image/*",
  className = "" 
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (multiple) {
      const newFiles = [...value, ...validFiles].slice(0, maxFiles);
      onChange(newFiles);
    } else {
      onChange(validFiles.slice(0, 1));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (index) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {value.length === 0 ? (
          <div>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <button
                type="button"
                onClick={openFileDialog}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Click to upload
              </button>
              <p className="text-gray-500">or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">
                {multiple ? `Up to ${maxFiles} images` : 'Single image'} • PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {value.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            {multiple && value.length < maxFiles && (
              <button
                type="button"
                onClick={openFileDialog}
                className="mt-4 text-blue-600 hover:text-blue-500 font-medium"
              >
                Add more images
              </button>
            )}
          </div>
        )}
      </div>
      
      {value.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {value.length} file{value.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
};

export default ImageUpload; 