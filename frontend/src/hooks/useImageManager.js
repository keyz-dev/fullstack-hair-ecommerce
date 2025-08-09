import { useState, useEffect, useRef, useCallback } from "react";
import useHairValidation from "./useHairValidation";

const useImageManager = (initialImages = []) => {
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const prevInitialImagesRef = useRef(initialImages);

  // Integrate hair validation
  const {
    validationStates,
    isValidating,
    validateImage,
    validateMultipleImages,
    getValidationState,
    clearValidationState,
    hasInvalidImages,
    hasPendingValidations,
  } = useHairValidation();

  useEffect(() => {
    // Only update if initialImages actually changed
    if (
      JSON.stringify(prevInitialImagesRef.current) !==
      JSON.stringify(initialImages)
    ) {
      setExistingImages(initialImages || []);
      setNewImages([]);
      prevInitialImagesRef.current = initialImages;

      // Clear validation states when images change
      validationStates.forEach((_, imageId) => {
        clearValidationState(imageId);
      });
    }
  }, [initialImages, clearValidationState]);

  const addImages = useCallback(
    async (files) => {
      const addedImages = [];

      for (const file of files) {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const newImage = {
              id: Date.now() + Math.random(),
              file,
              url: e.target.result,
              name: file.name,
            };

            setNewImages((prev) => [...prev, newImage]);
            addedImages.push(newImage);

            // Auto-validate the image
            validateImage(file, newImage.id);
          };

          reader.readAsDataURL(file);
        }
      }
    },
    [validateImage]
  );

  const removeExistingImage = useCallback((imageIndex) => {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== imageIndex)
    );
  }, []);

  const removeNewImage = useCallback(
    (imageId) => {
      setNewImages((prev) => prev.filter((img) => img.id !== imageId));
      // Clear validation state when image is removed
      clearValidationState(imageId);
    },
    [clearValidationState]
  );

  const getFormData = useCallback(() => {
    const data = new FormData();

    // Add existing images that weren't deleted
    data.append("existingImages", JSON.stringify(existingImages));

    // Add new images
    newImages.forEach((image) => {
      data.append("productImages", image.file);
    });

    return data;
  }, [existingImages, newImages]);

  const hasChanges = useCallback(
    (originalImages = []) => {
      return (
        existingImages.length !== originalImages.length || newImages.length > 0
      );
    },
    [existingImages, newImages]
  );

  const canProceed = useCallback(() => {
    // If there are no new images, we can proceed (existing images were already validated)
    if (newImages.length === 0) {
      return true;
    }

    // Can proceed if no invalid images and no pending validations for new images
    return !hasInvalidImages() && !hasPendingValidations();
  }, [newImages.length, hasInvalidImages, hasPendingValidations]);

  const getValidationSummary = useCallback(() => {
    const total = newImages.length;
    const validated = Array.from(validationStates.values()).filter(
      (state) => state.status === "completed"
    ).length;
    const valid = Array.from(validationStates.values()).filter(
      (state) => state.status === "completed" && state.isValid
    ).length;
    const invalid = Array.from(validationStates.values()).filter(
      (state) => state.status === "completed" && !state.isValid
    ).length;
    const pending = total - validated;

    return {
      total,
      validated,
      valid,
      invalid,
      pending,
      existingImagesCount: existingImages.length,
    };
  }, [newImages.length, validationStates, existingImages.length]);

  return {
    existingImages,
    newImages,
    addImages,
    removeExistingImage,
    removeNewImage,
    getFormData,
    hasChanges,
    canProceed,
    getValidationSummary,
    // Validation-related methods
    validationStates,
    isValidating,
    getValidationState,
    hasInvalidImages,
    hasPendingValidations,
  };
};

export default useImageManager;
