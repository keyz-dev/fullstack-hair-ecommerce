import { useState, useCallback } from "react";
import { hairValidationAPI } from "../api/hairValidation";

const useHairValidation = () => {
  const [validationStates, setValidationStates] = useState(new Map());
  const [isValidating, setIsValidating] = useState(false);

  const validateImage = useCallback(async (imageFile, imageId) => {
    if (!imageFile) return;

    // Set initial validation state
    setValidationStates((prev) =>
      new Map(prev).set(imageId, {
        status: "validating",
        isValid: null,
        confidence: null,
        message: "Validating image...",
      })
    );

    try {
      const result = await hairValidationAPI.validateSingleImage(imageFile);

      // Ensure we have the expected data structure
      if (!result.data) {
        throw new Error(
          "Invalid API response structure - missing data property"
        );
      }

      const validationState = {
        status: "completed",
        isValid: result.data.isValid,
        confidence: result.data.confidence,
        message: result.data.message,
        prediction: result.data.prediction,
      };

      setValidationStates((prev) =>
        new Map(prev).set(imageId, validationState)
      );
      return validationState;
    } catch (error) {
      console.error("Image validation error:", error);

      const validationState = {
        status: "error",
        isValid: false,
        confidence: 0,
        message: "Validation failed",
        error: error.message,
      };

      setValidationStates((prev) =>
        new Map(prev).set(imageId, validationState)
      );
      return validationState;
    }
  }, []);

  const validateMultipleImages = useCallback(
    async (imageFiles, imageIds) => {
      if (!imageFiles.length) return [];

      setIsValidating(true);

      try {
        const results = await hairValidationAPI.validateMultipleImages(
          imageFiles
        );

        console.log("Multiple images validation API response:", results);

        // Update validation states for all images
        const newValidationStates = new Map(validationStates);
        imageIds.forEach((imageId, index) => {
          const result =
            results.data?.results?.[index] || results.data || results;

          if (!result) {
            console.error(
              `No validation result found for image ${imageId} at index ${index}`
            );
            return;
          }

          const validationState = {
            status: "completed",
            isValid: result.isValid,
            confidence: result.confidence,
            message: result.message,
            prediction: result.prediction,
          };

          console.log(
            `Validation state for image ${imageId}:`,
            validationState
          );
          newValidationStates.set(imageId, validationState);
        });

        setValidationStates(newValidationStates);
        return results;
      } catch (error) {
        console.error("Multiple images validation error:", error);

        // Set error state for all images
        const newValidationStates = new Map(validationStates);
        imageIds.forEach((imageId) => {
          newValidationStates.set(imageId, {
            status: "error",
            isValid: false,
            confidence: 0,
            message: "Validation failed",
            error: error.message,
          });
        });

        setValidationStates(newValidationStates);
        throw error;
      } finally {
        setIsValidating(false);
      }
    },
    [validationStates]
  );

  const getValidationState = useCallback(
    (imageId) => {
      return (
        validationStates.get(imageId) || {
          status: "pending",
          isValid: null,
          confidence: null,
          message: "Pending validation",
        }
      );
    },
    [validationStates]
  );

  const clearValidationState = useCallback((imageId) => {
    setValidationStates((prev) => {
      const newMap = new Map(prev);
      newMap.delete(imageId);
      return newMap;
    });
  }, []);

  const hasInvalidImages = useCallback(() => {
    for (const [_, state] of validationStates) {
      if (state.status === "completed" && !state.isValid) {
        return true;
      }
    }
    return false;
  }, [validationStates]);

  const hasPendingValidations = useCallback(() => {
    for (const [_, state] of validationStates) {
      if (state.status === "validating") {
        return true;
      }
    }
    return false;
  }, [validationStates]);

  return {
    validationStates,
    isValidating,
    validateImage,
    validateMultipleImages,
    getValidationState,
    clearValidationState,
    hasInvalidImages,
    hasPendingValidations,
  };
};

export default useHairValidation;
