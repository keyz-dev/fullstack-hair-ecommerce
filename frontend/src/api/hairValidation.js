import api from "./index";

/**
 * Hair Validation API Service
 * Handles image validation before product creation
 */
export const hairValidationAPI = {
  /**
   * Validate a single hair image
   * @param {File} imageFile - Image file to validate
   * @returns {Promise<Object>} Validation result
   */
  validateSingleImage: async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await api.post(
        "/product/validate-single-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Hair validation error:", error);
      throw error;
    }
  },

  /**
   * Validate multiple hair images
   * @param {File[]} imageFiles - Array of image files to validate
   * @returns {Promise<Object>} Batch validation result
   */
  validateMultipleImages: async (imageFiles) => {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await api.post(
        "/product/validate-multiple-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Batch hair validation error:", error);
      throw error;
    }
  },
};
