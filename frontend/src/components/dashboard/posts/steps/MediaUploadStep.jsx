import React from 'react';
import { ImageUploadStep, VideoUploadStep } from '.';

const MediaUploadStep = ({
  mediaType,
  postImages = [],
  postVideo = null,
  thumbnail = null, 
  onImagesChange,
  onVideoChange,
  onThumbnailChange,
  onSave,
  onBack,
  loading
}) => {
  // If no media type is selected, show a message
  if (!mediaType) {
    return (
      <div className="w-full max-w-4xl text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Media Type Not Selected
          </h2>
          <p className="text-yellow-700">
            Please go back and select a media type (images or video) before proceeding.
          </p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate step based on media type
  if (mediaType === 'images') {
    return (
      <ImageUploadStep
        images={postImages}
        onImagesChange={onImagesChange}
        onSave={onSave}
        onBack={onBack}
        loading={loading}
      />
    );
  }

  if (mediaType === 'video') {
    return (
      <VideoUploadStep
        video={postVideo}
        thumbnail={thumbnail}
        onVideoChange={onVideoChange}
        onThumbnailChange={onThumbnailChange}
        onSave={onSave}
        onBack={onBack}
        loading={loading}
      />
    );
  }

  // Fallback for unknown media type
  return (
    <div className="w-full max-w-4xl text-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-red-800 mb-2">
          Invalid Media Type
        </h2>
        <p className="text-red-700">
          The selected media type "{mediaType}" is not supported. Please select either "images" or "video".
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default MediaUploadStep; 