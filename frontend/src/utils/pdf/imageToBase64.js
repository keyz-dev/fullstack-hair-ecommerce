
  // Helper function to convert image URL to base64 with validation
export const imageToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
      
      const blob = await response.blob();
      
      // Validate image type
      if (!blob.type.startsWith('image/')) {
        throw new Error(`Invalid image type: ${blob.type}`);
      }
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result;
          // Additional validation - check if base64 is complete
          if (!base64 || base64.length < 100) {
            reject(new Error('Generated base64 is too short or empty'));
            return;
          }
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };
