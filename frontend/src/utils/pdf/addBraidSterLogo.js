import { processImageSafely } from './processImageSafely';
import { imageToBase64 } from './imageToBase64';
import { convertToJPEG } from './convertToJPEG';
import logo from '../../assets/logo/logo.png';

  // Helper function to add BraidSter logo
  export const addBraidSterLogo = async (doc, x, y, width = 40, height = 20, logoPath = null) => {
    try {
      let logoBase64 = null;
      
      // Try different logo path strategies
      const logoPaths = [
        logoPath,
        logo,
      ].filter(Boolean);
      
      // Try each path until one works
      for (const path of logoPaths) {
        try {
          // First try safe canvas processing (fixes corrupt PNGs)
          logoBase64 = await processImageSafely(path);
          
          // If canvas method fails, try direct base64 conversion
          if (!logoBase64) {
            logoBase64 = await imageToBase64(path);
          }
          
          if (logoBase64) {
            break;
          }
        } catch (error) {
          console.error(`Failed to load logo from ${path}:`, error.message);
          continue;
        }
      }
      
      if (logoBase64) {
        try {
          // Try adding the image with error handling
          doc.addImage(logoBase64, 'PNG', x, y, width, height);
        } catch (pdfError) {
          console.error('jsPDF error adding image:', pdfError);
          
          // Try converting to JPEG format as fallback
          try {
            const jpegBase64 = await convertToJPEG(logoBase64);
            if (jpegBase64) {
              doc.addImage(jpegBase64, 'JPEG', x, y, width, height);
              console.log('Successfully added logo as JPEG fallback');
            } else {
              throw new Error('JPEG conversion failed');
            }
          } catch (jpegError) {
            console.error('JPEG fallback failed:', jpegError);
            throw new Error('All image formats failed');
          }
        }
      } else {
        console.warn('All logo paths failed, using fallback text logo');
        // Fallback to styled text logo if all paths fail
        const brandOrange = [242, 153, 74]; // #F2994A
        const brandGold = [231, 166, 8]; // #E7A608
        
        // Logo background circle
        doc.setFillColor(...brandOrange);
        doc.circle(x + 10, y + 10, 8, 'F');
        
        // Logo text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...brandGold);
        doc.text('BRAIDSTER', x + 25, y + 8);
        
        // Tagline
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Hair & Beauty Commerce', x + 25, y + 15);
      }
    } catch (error) {
      console.error('Error adding logo:', error);
      // Fallback to text logo
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(231, 166, 8);
      doc.text('BRAIDSTER', x, y + 12);
    }
  };