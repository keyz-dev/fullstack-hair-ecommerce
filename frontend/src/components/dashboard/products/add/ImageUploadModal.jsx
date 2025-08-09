import React, { useRef, useState, useEffect } from "react";
import { hairValidationAPI } from "../../../../api/hairValidation";
import {
  ModalHeader,
  DragDropArea,
  ImageGrid,
  ValidationSummary,
  ModalFooter,
} from "./ImageUploadModal/index";

const ImageUploadModal = ({ isOpen, onClose, images, onImagesChange }) => {
  const fileInputRef = useRef(null);
  const [newImages, setNewImages] = useState(new Set());
  const [validatingImages, setValidatingImages] = useState(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [autoCloseTimer, setAutoCloseTimer] = useState(null);

  // Track which images are new (not yet validated) when modal opens
  useEffect(() => {
    if (isOpen) {
      const validatedImageIds = new Set(
        images
          .filter((img) => img.isValid === true || img.isValid === false)
          .map((img) => img.id)
      );
      const newImageIds = new Set(
        images
          .filter((img) => !validatedImageIds.has(img.id))
          .map((img) => img.id)
      );
      setNewImages(newImageIds);

      // Clear any existing auto-close timer
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        setAutoCloseTimer(null);
      }
    }
  }, [isOpen, images]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
      }
    };
  }, [autoCloseTimer]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    event.target.value = "";

    // Add files immediately without validation
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        addImageWithoutValidation(file);
      }
    }
  };

  const addImageWithoutValidation = (file) => {
    const imageId = Date.now() + Math.random();

    // Create image object without validation
    const newImage = {
      id: imageId,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isValidating: false,
      isValid: null, // null means not yet validated
    };

    // Add to images immediately
    onImagesChange((prev) => [...prev, newImage]);

    // Mark as new image
    setNewImages((prev) => new Set([...prev, imageId]));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    // Add dropped files immediately without validation
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        addImageWithoutValidation(file);
      }
    }
  };

  const removeImage = (imageId) => {
    onImagesChange((prev) => prev.filter((img) => img.id !== imageId));

    // Clear from new images
    setNewImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(imageId);
      return newSet;
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Function to check if all images are valid
  const areAllImagesValid = () => {
    return images.every((img) => img.isValid === true);
  };

  // Function to check if there are any invalid images
  const hasInvalidImages = () => {
    return images.some((img) => img.isValid === false);
  };

  // Function to auto-close modal after successful validation
  const scheduleAutoClose = () => {
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
    }

    const timer = setTimeout(() => {
      onClose();
      setAutoCloseTimer(null);
    }, 1500); // 1.5 second delay

    setAutoCloseTimer(timer);
  };

  const validateNewImages = async () => {
    const imagesToValidate = images.filter((img) => newImages.has(img.id));

    if (imagesToValidate.length === 0) {
      // No new images to validate, check if we should auto-close
      if (areAllImagesValid() && !hasInvalidImages()) {
        scheduleAutoClose();
      }
      return;
    }

    setIsUploading(true);
    setValidatingImages(new Set(imagesToValidate.map((img) => img.id)));

    try {
      // Validate each new image
      for (const image of imagesToValidate) {
        try {
          const validationResult = await hairValidationAPI.validateSingleImage(
            image.file
          );

          // Update image validation status
          onImagesChange((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? {
                    ...img,
                    isValidating: false,
                    isValid: validationResult.data.isValid,
                    validationMessage: validationResult.data.message,
                  }
                : img
            )
          );

          if (validationResult.data.isValid) {
            console.log(`✅ ${image.name} validated successfully`);
          } else {
            console.log(
              `❌ ${image.name} failed validation: ${validationResult.data.message}`
            );
          }
        } catch (error) {
          console.error(`Validation failed for ${image.name}:`, error);

          // Mark as validation error with better error message
          let errorMessage = "Validation failed";

          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          onImagesChange((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? {
                    ...img,
                    isValidating: false,
                    isValid: false,
                    validationMessage: errorMessage,
                  }
                : img
            )
          );
        }
      }
    } finally {
      setIsUploading(false);
      setValidatingImages(new Set());
      setNewImages(new Set()); // Clear new images since they're now validated

      // Check if we should auto-close after validation
      if (areAllImagesValid() && !hasInvalidImages()) {
        scheduleAutoClose();
      }
      // If there are invalid images, modal stays open for user to take action
    }
  };

  const retryValidation = async (imageId) => {
    const imageToRetry = images.find((img) => img.id === imageId);
    if (!imageToRetry) return;

    setIsUploading(true);
    setValidatingImages(new Set([imageId]));

    try {
      const validationResult = await hairValidationAPI.validateSingleImage(
        imageToRetry.file
      );

      onImagesChange((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                isValidating: false,
                isValid: validationResult.data.isValid,
                validationMessage: validationResult.data.message,
              }
            : img
        )
      );

      if (validationResult.data.isValid) {
        console.log(`✅ ${imageToRetry.name} retried validation successfully`);

        // Check if all images are now valid and auto-close
        if (areAllImagesValid() && !hasInvalidImages()) {
          scheduleAutoClose();
        }
      } else {
        console.log(
          `❌ ${imageToRetry.name} failed retried validation: ${validationResult.data.message}`
        );
      }
    } catch (error) {
      console.error(
        `Retried validation failed for ${imageToRetry.name}:`,
        error
      );

      let errorMessage = "Retried validation failed";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      onImagesChange((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                isValidating: false,
                isValid: false,
                validationMessage: errorMessage,
              }
            : img
        )
      );
    } finally {
      setIsUploading(false);
      setValidatingImages(new Set());
    }
  };

  const retryAllFailed = () => {
    const invalidImages = images.filter((img) => img.isValid === false);
    invalidImages.forEach((img) => retryValidation(img.id));
  };

  // Count images by status
  const pendingImages = images.filter((img) => newImages.has(img.id)).length;
  const validatedImages = images.filter((img) => img.isValid === true).length;
  const invalidImages = images.filter((img) => img.isValid === false).length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="bg-white rounded-sm w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <ModalHeader
          images={images}
          pendingImages={pendingImages}
          validatedImages={validatedImages}
          invalidImages={invalidImages}
          onBrowseClick={handleBrowseClick}
          onClose={onClose}
          isUploading={isUploading}
        />

        <div className="p-6 max-h-96 overflow-y-auto">
          {images.length === 0 ? (
            <DragDropArea
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onBrowseClick={handleBrowseClick}
              isUploading={isUploading}
            />
          ) : (
            <ImageGrid
              images={images}
              validatingImages={validatingImages}
              onRemove={removeImage}
              onRetry={retryValidation}
              isUploading={isUploading}
            />
          )}
        </div>

        {/* Validation Summary */}
        {images.length > 0 && (
          <ValidationSummary
            images={images}
            onRetryAllFailed={retryAllFailed}
            isUploading={isUploading}
          />
        )}

        <ModalFooter
          images={images}
          pendingImages={pendingImages}
          isUploading={isUploading}
          onClose={onClose}
          onUpload={validateNewImages}
          onRevalidateFailed={retryAllFailed}
          hasInvalidImages={hasInvalidImages()}
        />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default ImageUploadModal;
