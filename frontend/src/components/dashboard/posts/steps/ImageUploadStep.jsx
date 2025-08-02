import { useState } from "react";
import { PostImageUploadModal } from "../";
import { X, ImageIcon } from "lucide-react";
import { Button } from "../../../ui";

const ImageUploadStep = ({ images = [], onImagesChange, onSave, onBack, loading }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const primaryImage = images[0];
  const hasImages = images.length > 0;

  const handleAddPhotos = () => {
    setIsModalOpen(true); 
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddMorePhotos = () => {
    setIsModalOpen(true);
  };

  const removeImageFromMain = (imageId) => {
    onImagesChange((prev) => prev.filter((img) => img.id !== imageId));
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          {hasImages
            ? "How does this Look?"
            : "Add photos to showcase your work"}
        </h2>
        {hasImages ? (
          <p className="text-gray-600">Review and confirm your images</p>
        ) : (
          <p className="text-gray-600">
            Upload at least 1 image to get started. You can add up to 10 images.
          </p>
        )}
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button
            onClickHandler={handleAddMorePhotos}
            additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
            leadingIcon={"fas fa-plus"}
          >
            {hasImages ? 'Add More Images' : 'Add Images'}
          </Button>
        </div>
        
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-[50vh] overflow-y-auto">
          {hasImages ? (
            <div className="space-y-6 p-2 sm:p-6">
              {/* Primary Image */}
              <div className="relative">
                <div className="aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={primaryImage.url}
                    alt="Primary photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  Primary Photo
                </div>
                {/* Caption Preview */}
                {primaryImage.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-3">
                    {primaryImage.caption}
                  </div>
                )}
              </div>

              {/* Additional Images Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.slice(1, 7).map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={image.url}
                          alt={`Photo ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Order Badge */}
                        <div className="absolute top-2 left-2 bg-white bg-opacity-90 text-primary px-2 py-1 rounded-full text-xs font-medium">
                          {image.order + 1}
                        </div>
                      </div>
                      {/* Caption Preview */}
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate">
                          {image.caption}
                        </div>
                      )}
                      <button
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        onClick={() => removeImageFromMain(image.id)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Show more indicator */}
              {images.length > 7 && (
                <div className="text-center text-gray-500 text-sm">
                  +{images.length - 7} more photos
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-accent" />
                </div>
              </div>
              <Button
                onClickHandler={handleAddPhotos}
                additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Add Photos
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button
            onClickHandler={onBack}
            additionalClasses="border border-gray-300 text-gray-700 hover:bg-gray-50"
            leadingIcon={"fas fa-arrow-left"}
          >
            Back
          </Button>
          <Button
            onClickHandler={onSave}
            additionalClasses="bg-accent text-white hover:bg-accent/90"
            isLoading={loading}
            isDisabled={images.length < 1 || loading}
          >
            Continue
          </Button>
        </div>
      </section>

      {/* Modal */}
      <PostImageUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        images={images}
        onImagesChange={onImagesChange}
      />
    </div>
  );
};

export default ImageUploadStep; 