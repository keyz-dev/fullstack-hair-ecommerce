import React from 'react';
import { ImageUpload, VideoUpload, Input, Textarea } from '../../../../ui';

const MediaStep = ({ formData, errors, onInputChange }) => {
  const handleImageChange = (images) => {
    onInputChange('images', images);
    // Initialize alt texts and captions arrays if needed
    if (images.length > 0) {
      const currentAlts = formData.imageAlts || [];
      const currentCaptions = formData.imageCaptions || [];
      
      // Extend arrays to match image count
      while (currentAlts.length < images.length) {
        currentAlts.push('');
      }
      while (currentCaptions.length < images.length) {
        currentCaptions.push('');
      }
      
      onInputChange('imageAlts', currentAlts);
      onInputChange('imageCaptions', currentCaptions);
    }
  };

  const handleVideoChange = (videos) => {
    onInputChange('videos', videos);
    // Initialize video captions array if needed
    if (videos.length > 0) {
      const currentCaptions = formData.videoCaptions || [];
      
      // Extend array to match video count
      while (currentCaptions.length < videos.length) {
        currentCaptions.push('');
      }
      
      onInputChange('videoCaptions', currentCaptions);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUpload
          label="Images"
          value={formData.images}
          onChange={handleImageChange}
          error={errors.images}
          multiple
        />
        <VideoUpload
          label="Videos"
          value={formData.videos}
          onChange={handleVideoChange}
          error={errors.videos}
          multiple
        />
      </div>

      {/* Image Alt Texts and Captions */}
      {formData.images && formData.images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Image Details</h4>
          {formData.images.map((image, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <Input
                label={`Alt Text for Image ${index + 1}`}
                value={formData.imageAlts?.[index] || ''}
                onChange={(e) => {
                  const newAlts = [...(formData.imageAlts || [])];
                  newAlts[index] = e.target.value;
                  onInputChange('imageAlts', newAlts);
                }}
                placeholder="Describe the image for accessibility..."
              />
              <Textarea
                label={`Caption for Image ${index + 1}`}
                value={formData.imageCaptions?.[index] || ''}
                onChange={(e) => {
                  const newCaptions = [...(formData.imageCaptions || [])];
                  newCaptions[index] = e.target.value;
                  onInputChange('imageCaptions', newCaptions);
                }}
                rows={2}
                placeholder="Add a caption for this image..."
              />
            </div>
          ))}
        </div>
      )}

      {/* Video Captions */}
      {formData.videos && formData.videos.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Video Captions</h4>
          {formData.videos.map((video, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <Textarea
                label={`Caption for Video ${index + 1}`}
                value={formData.videoCaptions?.[index] || ''}
                onChange={(e) => {
                  const newCaptions = [...(formData.videoCaptions || [])];
                  newCaptions[index] = e.target.value;
                  onInputChange('videoCaptions', newCaptions);
                }}
                rows={2}
                placeholder="Add a caption for this video..."
              />
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Media Guidelines</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Images: JPG, PNG, WebP (max 5MB each)</li>
          <li>• Videos: MP4, MOV (max 50MB each)</li>
          <li>• Maximum 10 images and 3 videos per post</li>
          <li>• First image will be used as the featured image</li>
          <li>• Alt text helps with accessibility and SEO</li>
        </ul>
      </div>
    </div>
  );
};

export { MediaStep }; 