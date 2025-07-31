  // Helper function to convert image to canvas and then to base64 (fixes corruption issues)
  export const processImageSafely = async (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Handle CORS
      
      img.onload = () => {
        try {
          // Create canvas to redraw image (fixes corruption)
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          // Draw image to canvas
          ctx.drawImage(img, 0, 0);
          
          // Convert canvas to base64 (this often fixes corrupt PNGs)
          const base64 = canvas.toDataURL('image/png', 1.0);
          resolve(base64);
        } catch (error) {
          console.error('Canvas processing failed:', error);
          resolve(null);
        }
      };
      
      img.onerror = () => {
        console.error('Image failed to load');
        resolve(null);
      };
      
      img.src = imageUrl;
    });
  };