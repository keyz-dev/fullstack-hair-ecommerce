import React from "react";
import ImageItem from "./ImageItem";

const ImageGrid = ({
  images,
  validatingImages,
  onRemove,
  onRetry,
  isUploading,
}) => {
  const getValidationStatus = (imageId) => {
    if (validatingImages.has(imageId)) {
      return "validating";
    }

    const image = images.find((img) => img.id === imageId);
    if (!image) return "unknown";

    if (image.isValid === null) {
      return "pending";
    }

    return image.isValid ? "valid" : "invalid";
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image) => (
        <ImageItem
          key={image.id}
          image={image}
          validationStatus={getValidationStatus(image.id)}
          onRemove={onRemove}
          onRetry={onRetry}
          isUploading={isUploading}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
