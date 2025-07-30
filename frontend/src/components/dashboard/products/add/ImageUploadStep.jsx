import { useState } from "react";
import { ImageUploadModal } from "./";
import { X, ImageIcon } from "lucide-react";
import { Button } from "../../../ui";

const ImageUploadStep = ({ images = [], onImagesChange, onSave, loading, onBack }) => {
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
    <div className="max-w-3xl mx-auto py-6 px-2">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-semibold mb-2">
          {hasImages
            ? "How does this Look?"
            : `Add some photos of your Product`}
        </h1>
        {hasImages ? (
          <p className="text-secondary">Confirm images</p>
        ) : (
          <p className="text-secondary">
            You'll need at least 2 photos to get started. You can add more or
            make changes later
          </p>
        )}
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button
            onClickHandler={handleAddMorePhotos}
            additionalClasses="border border-line_clr text-secondary"
            leadingIcon={"fas fa-plus"}
          >
            Add Image
          </Button>
        </div>
        <div className="bg-light_bg rounded-sm border-[1px] border-dashed border-line_clr [border-style:dashed] [border-spacing:1rem] [border-width:2px] h-[47vh] overflow-y-auto">
          {hasImages ? (
            <div className="space-y-6">
              {/* Primary Image */}
              <div className="relative">
                <div className="aspect-[16/9] rounded-sm overflow-hidden bg-gray-100">
                  <img
                    src={primaryImage.url}
                    alt="Primary photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-white bg-opacity-70 text-primary px-3 py-1 rounded text-sm">
                  Primary Photo
                </div>
              </div>

              {/* Additional Images Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {images.slice(1, 5).map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-sm overflow-hidden bg-gray-100">
                        <img
                          src={image.url}
                          alt={`Photo ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:bg-opacity-70"
                        onClick={() => removeImageFromMain(image.id)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Show more indicator */}
              {images.length > 5 && (
                <div className="text-center text-gray-500 text-sm">
                  +{images.length - 5} more photos
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-8">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <Button
                onClickHandler={handleAddPhotos}
                additionalClasses="border border-line_clr text-secondary"
              >
                Add Photos
              </Button>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <Button
            onClickHandler={onBack}
            additionalClasses="border border-line_clr text-secondary"
            leadingIcon={"fas fa-arrow-left"}
          >
            Back
          </Button>
          <Button
            onClickHandler={onSave}
            additionalClasses="bg-accent text-white"
            isLoading={loading}
            isDisabled={images.length < 2 || loading}
          >
            Add Features
          </Button>
        </div>
      </section>

      {/* Modal */}
      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        images={images}
        onImagesChange={onImagesChange}
      />
    </div>
  );
};

export default ImageUploadStep;
