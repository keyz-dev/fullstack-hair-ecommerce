  // Helper function to convert PNG to JPEG (fixes jsPDF PNG issues)
  export const convertToJPEG = async (base64Image) => {
    return new Promise((resolve) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          // Fill white background (JPEG doesn't support transparency)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw image
          ctx.drawImage(img, 0, 0);
          
          // Convert to JPEG
          const jpegBase64 = canvas.toDataURL('image/jpeg', 0.95);
          resolve(jpegBase64);
        };
        
        img.onerror = () => resolve(null);
        img.src = base64Image;
      } catch (error) {
        console.error('JPEG conversion error:', error);
        resolve(null);
      }
    });
  };
