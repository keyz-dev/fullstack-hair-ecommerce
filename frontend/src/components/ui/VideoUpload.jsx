import React, { useRef, useState } from 'react';
import { Upload, X, Video } from 'lucide-react';

const VideoUpload = ({ 
  label, 
  value = [], 
  onChange, 
  multiple = false,
  maxFiles = 5,
  accept = "video/*",
  className = "" 
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('video/'));
    
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <Video className="mx-auto h-12 w-12 text-gray-400" />
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
                {multiple ? `Up to ${maxFiles} videos` : 'Single video'} • MP4, MOV, AVI up to 100MB
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="space-y-3">
              {value.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Video className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
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
                Add more videos
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

export default VideoUpload; 