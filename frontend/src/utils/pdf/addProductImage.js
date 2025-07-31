import { processImageSafely } from './processImageSafely';
import { imageToBase64 } from './imageToBase64';
import { convertToJPEG } from './convertToJPEG';
  
  // Helper function to load and add product images
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
          // Add the actual product image
          doc.addImage(imageBase64, format, x, y, width, height);
          
          // Add subtle border around image
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
                doc.addImage(jpegBase64, 'JPEG', x, y, width, height);
                
                // Add subtle border around image
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