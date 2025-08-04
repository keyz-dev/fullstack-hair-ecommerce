import { processImageSafely } from './processImageSafely';
import { imageToBase64 } from './imageToBase64';
import { convertToJPEG } from './convertToJPEG';
  
  // Helper function to load and add product images with object-cover behavior
  export const addProductImage = async (doc, imageUrl, x, y, width = 25, height = 25) => {
    if (!imageUrl) {
      // Create placeholder if no image URL
      doc.setFillColor(240, 240, 240);
      doc.rect(x, y, width, height, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(x, y, width, height);
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('NO IMG', x + width/2 - 6, y + height/2 + 2);
      return false;
    }

    try {
      // Convert image URL to base64 with safe processing
      let imageBase64 = await processImageSafely(imageUrl);
      
      // Fallback to direct conversion if canvas method fails
      if (!imageBase64) {
        imageBase64 = await imageToBase64(imageUrl);
      }
      
      if (imageBase64) {
        // Determine image format from URL or base64 string
        let format = 'JPEG';
        if (imageUrl.toLowerCase().includes('.png') || imageBase64.includes('data:image/png')) {
          format = 'PNG';
        } else if (imageUrl.toLowerCase().includes('.gif') || imageBase64.includes('data:image/gif')) {
          format = 'GIF';
        }
        
        try {
          // Get image dimensions to calculate aspect ratio
          const img = new Image();
          img.src = imageBase64;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          
          const imgWidth = img.naturalWidth;
          const imgHeight = img.naturalHeight;
          
          // Calculate aspect ratios
          const containerAspectRatio = width / height;
          const imageAspectRatio = imgWidth / imgHeight;
          
          let finalWidth, finalHeight, finalX, finalY;
          
          if (imageAspectRatio > containerAspectRatio) {
            // Image is wider than container - fit to height, center horizontally
            finalHeight = height;
            finalWidth = height * imageAspectRatio;
            finalX = x + (width - finalWidth) / 2;
            finalY = y;
          } else {
            // Image is taller than container - fit to width, center vertically
            finalWidth = width;
            finalHeight = width / imageAspectRatio;
            finalX = x;
            finalY = y + (height - finalHeight) / 2;
          }
          
          // Add the actual product image with calculated dimensions and position
          doc.addImage(imageBase64, format, finalX, finalY, finalWidth, finalHeight);
          
          // Add subtle border around the container (not the image)
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.2);
          doc.rect(x, y, width, height);
          
          return true;
        } catch (pdfError) {
          console.warn(`jsPDF error with ${format} format:`, pdfError);
          
          // Try converting to JPEG as fallback
          if (format !== 'JPEG') {
            try {
              const jpegBase64 = await convertToJPEG(imageBase64);
              if (jpegBase64) {
                // Get image dimensions for JPEG as well
                const img = new Image();
                img.src = jpegBase64;
                
                await new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = reject;
                });
                
                const imgWidth = img.naturalWidth;
                const imgHeight = img.naturalHeight;
                
                // Calculate aspect ratios
                const containerAspectRatio = width / height;
                const imageAspectRatio = imgWidth / imgHeight;
                
                let finalWidth, finalHeight, finalX, finalY;
                
                if (imageAspectRatio > containerAspectRatio) {
                  // Image is wider than container - fit to height, center horizontally
                  finalHeight = height;
                  finalWidth = height * imageAspectRatio;
                  finalX = x + (width - finalWidth) / 2;
                  finalY = y;
                } else {
                  // Image is taller than container - fit to width, center vertically
                  finalWidth = width;
                  finalHeight = width / imageAspectRatio;
                  finalX = x;
                  finalY = y + (height - finalHeight) / 2;
                }
                
                doc.addImage(jpegBase64, 'JPEG', finalX, finalY, finalWidth, finalHeight);
                
                // Add subtle border around the container
                doc.setDrawColor(220, 220, 220);
                doc.setLineWidth(0.2);
                doc.rect(x, y, width, height);
                
                return true;
              }
            } catch (jpegError) {
              console.error('JPEG conversion failed:', jpegError);
            }
          }
          
          throw pdfError;
        }
      } else {
        throw new Error('Failed to convert image to base64');
      }
    } catch (error) {
      console.error('Error loading product image:', error);
      
      // Create error placeholder
      doc.setFillColor(250, 240, 240);
      doc.rect(x, y, width, height, 'F');
      doc.setDrawColor(220, 180, 180);
      doc.rect(x, y, width, height);
      
      doc.setFontSize(7);
      doc.setTextColor(180, 120, 120);
      doc.text('IMG', x + width/2 - 5, y + height/2 - 1);
      doc.text('ERROR', x + width/2 - 7, y + height/2 + 4);
      
      return false;
    }
  };