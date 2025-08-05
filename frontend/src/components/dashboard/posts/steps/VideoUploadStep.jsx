import { useState, useRef } from "react";
import { VideoIcon, Upload, X, ArrowLeft } from "lucide-react";
import { Button } from "../../../ui";

const VideoUploadStep = ({ video = null, thumbnail = null, onVideoChange, onThumbnailChange, onSave, onBack, loading }) => {
  const [isVideoDragOver, setIsVideoDragOver] = useState(false);
  const [isThumbnailDragOver, setIsThumbnailDragOver] = useState(false);
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid video file (MP4, AVI, MOV, WMV, FLV, WebM, MKV)');
        event.target.value = "";
        return;
      }
      
      // Validate file size (50MB limit as per backend)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert('Video file size must be less than 50MB');
        event.target.value = "";
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        onVideoChange({
          file,
          url: e.target.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const handleThumbnailSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onThumbnailChange({
          file,
          url: e.target.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const handleVideoBrowse = () => {
    videoInputRef.current?.click();
  };

  const handleThumbnailBrowse = () => {
    thumbnailInputRef.current?.click();
  };

  const removeVideo = () => {
    onVideoChange(null);
  };

  const removeThumbnail = () => {
    onThumbnailChange(null);
  };

  const handleVideoDragOver = (e) => {
    e.preventDefault();
    setIsVideoDragOver(true);
  };

  const handleVideoDragLeave = (e) => {
    e.preventDefault();
    setIsVideoDragOver(false);
  };

  const handleThumbnailDragOver = (e) => {
    e.preventDefault();
    setIsThumbnailDragOver(true);
  };

  const handleThumbnailDragLeave = (e) => {
    e.preventDefault();
    setIsThumbnailDragOver(false);
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    setIsVideoDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith("video/"));
    if (videoFile) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/mkv'];
      if (!allowedTypes.includes(videoFile.type)) {
        alert('Please select a valid video file (MP4, AVI, MOV, WMV, FLV, WebM, MKV)');
        return;
      }
      
      // Validate file size (50MB limit as per backend)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (videoFile.size > maxSize) {
        alert('Video file size must be less than 50MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        onVideoChange({
          file: videoFile,
          url: e.target.result,
          name: videoFile.name,
        });
      };
      reader.readAsDataURL(videoFile);
    }
  };

  const handleThumbnailDrop = (e) => {
    e.preventDefault();
    setIsThumbnailDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith("image/"));
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onThumbnailChange({
          file: imageFile,
          url: e.target.result,
          name: imageFile.name,
        });
      };
      reader.readAsDataURL(imageFile);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Upload Your Video
        </h2>
        <p className="text-gray-600">
          Upload a video file and add a custom thumbnail
        </p>
      </div>

      <div className="space-y-6">
        {/* Video Upload Section */}
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">Video File</h3>
            
            {video ? (
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <video
                    src={video.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                </div>
                <button
                  onClick={removeVideo}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-2 text-sm text-gray-600">
                  {video.name}
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isVideoDragOver 
                    ? 'border-accent bg-accent/5' 
                    : 'border-gray-300'
                }`}
                onDragOver={handleVideoDragOver}
                onDragLeave={handleVideoDragLeave}
                onDrop={handleVideoDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center">
                    <VideoIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Upload Video</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Drag and drop or browse for video files
                    </p>
                  </div>
                  <Button
                    onClickHandler={handleVideoBrowse}
                    additionalClasses="bg-accent text-white hover:bg-accent/90"
                  >
                    Browse Video
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Upload Section */}
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">Video Thumbnail</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add a custom thumbnail for your video (optional)
            </p>
            
            {thumbnail ? (
              <div className="relative inline-block">
                <div className="aspect-video w-64 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={thumbnail.url}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={removeThumbnail}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isThumbnailDragOver 
                    ? 'border-accent bg-accent/5' 
                    : 'border-gray-300'
                }`}
                onDragOver={handleThumbnailDragOver}
                onDragLeave={handleThumbnailDragLeave}
                onDrop={handleThumbnailDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Upload Thumbnail</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Drag and drop or browse for image files
                    </p>
                  </div>
                  <Button
                    onClickHandler={handleThumbnailBrowse}
                    additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Browse Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            onClickHandler={onBack}
            additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
            leadingIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <Button
            onClickHandler={onSave}
            additionalClasses="bg-accent text-white hover:bg-accent/90"
            isLoading={loading}
            isDisabled={!video || loading}
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/mp4,video/avi,video/mov,video/wmv,video/flv,video/webm,video/mkv"
        onChange={handleVideoSelect}
        className="hidden"
      />
      <input
        ref={thumbnailInputRef}
        type="file"
        accept="image/*"
        onChange={handleThumbnailSelect}
        className="hidden"
      />
    </div>
  );
};

export default VideoUploadStep; 