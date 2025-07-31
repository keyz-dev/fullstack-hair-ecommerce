import jsPDF from 'jspdf';

export const generateBraidSterInvoice = async (orderData, customLogoPath = null) => {
  const {
    orderNumber,
    customerInfo,
    shippingAddress,
    orderSummary,
    selectedPaymentMethod,
    paymentInfo,
    cartItems
  } = orderData;

  // Create new PDF document with A4 size
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Set document properties
  doc.setProperties({
    title: `BraidSter Invoice ${orderNumber}`,
    subject: 'Order Invoice',
    author: 'BraidSter',
    creator: 'BraidSter Commerce Platform',
    keywords: 'invoice, order, braidster'
  });

  // Helper function to convert PNG to JPEG (fixes jsPDF PNG issues)
  const convertToJPEG = async (base64Image) => {
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

  // Helper function to convert image URL to base64 with validation
  const imageToBase64 = async (url) => {
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

  // Helper function to convert image to canvas and then to base64 (fixes corruption issues)
  const processImageSafely = async (imageUrl) => {
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

  // Helper function to add BraidSter logo
  const addBraidSterLogo = async (x, y, width = 40, height = 20, logoPath = null) => {
    try {
      let logoBase64 = null;
      
      // Try different logo path strategies
      const logoPaths = [
        logoPath,
        '/src/assets/logo/logo.png',
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

  // Helper function to load and add product images
  const addProductImage = async (imageUrl, x, y, width = 25, height = 25) => {
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

  // Header Section
  const headerHeight = 40;
  
  // Header background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  
  // Add logo
  await addBraidSterLogo(15, 10, 40, 20, customLogoPath);
  
  // Invoice title and number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(60, 60, 60);
  doc.text('INVOICE', pageWidth - 15, 20, { align: 'right' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`#${orderNumber}`, pageWidth - 15, 28, { align: 'right' });
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 15, 35, { align: 'right' });

  // Horizontal line separator
  doc.setDrawColor(231, 166, 8);
  doc.setLineWidth(2);
  doc.line(15, headerHeight + 5, pageWidth - 15, headerHeight + 5);

  let currentY = headerHeight + 20;

  // Customer and Shipping Information Section
  const infoSectionHeight = 45;
  
  // Customer Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text('BILL TO:', 15, currentY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  currentY += 8;
  doc.text(`${customerInfo?.firstName || ''} ${customerInfo?.lastName || ''}`, 15, currentY);
  currentY += 5;
  doc.text(`${customerInfo?.email || ''}`, 15, currentY);
  currentY += 5;
  doc.text(`${customerInfo?.phone || ''}`, 15, currentY);

  // Shipping Address
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text('SHIP TO:', pageWidth/2 + 10, headerHeight + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  let shipY = headerHeight + 28;
  doc.text(`${shippingAddress?.address || ''}`, pageWidth/2 + 10, shipY);
  shipY += 5;
  doc.text(`${shippingAddress?.city || ''}, ${shippingAddress?.state || ''} ${shippingAddress?.postalCode || ''}`, pageWidth/2 + 10, shipY);
  shipY += 5;
  doc.text(`${shippingAddress?.country || ''}`, pageWidth/2 + 10, shipY);

  currentY = headerHeight + 20 + infoSectionHeight;

  // Order Items Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(60, 60, 60);
  doc.text('ORDER ITEMS', 15, currentY);
  currentY += 10;

  // Table header
  const tableStartY = currentY;
  const rowHeight = 35;
  const headerRowHeight = 12;
  
  // Header background
  doc.setFillColor(248, 249, 250);
  doc.rect(15, tableStartY, pageWidth - 30, headerRowHeight, 'F');
  
  // Header borders
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.rect(15, tableStartY, pageWidth - 30, headerRowHeight);
  
  // Column definitions
  const columns = [
    { title: 'PRODUCT', x: 20, width: 80 },
    { title: 'QTY', x: 105, width: 20 },
    { title: 'UNIT PRICE', x: 130, width: 30 },
    { title: 'TOTAL', x: 165, width: 30 }
  ];
  
  // Header text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  columns.forEach(col => {
    doc.text(col.title, col.x, tableStartY + 8);
  });
  
  currentY = tableStartY + headerRowHeight;
  
  // Product rows
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const isEven = i % 2 === 0;
    
    // Alternate row background
    if (isEven) {
      doc.setFillColor(252, 252, 252);
      doc.rect(15, currentY, pageWidth - 30, rowHeight, 'F');
    }
    
    // Row border
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.rect(15, currentY, pageWidth - 30, rowHeight);
    
    // Add product image from the images array
    const productImageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
    await addProductImage(productImageUrl, 20, currentY + 5, 25, 25);
    
    // Product details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const productName = item.name.length > 35 ? item.name.substring(0, 35) + '...' : item.name;
    doc.text(productName, 50, currentY + 12);
    
    // Product description/SKU (if available)
    if (item.sku || item.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(item.sku || item.description?.substring(0, 40) || '', 50, currentY + 20);
    }
    
    // Quantity
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(item.quantity.toString(), columns[1].x, currentY + 18, { align: 'center' });
    
    // Unit price
    doc.text(`${item.price.toLocaleString()} XAF`, columns[2].x, currentY + 18);
    
    // Total price
    doc.setFont('helvetica', 'bold');
    doc.text(`${(item.price * item.quantity).toLocaleString()} XAF`, columns[3].x, currentY + 18);
    
    currentY += rowHeight;
  }
  
  // Table bottom border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(1);
  doc.line(15, currentY, pageWidth - 15, currentY);
  
  currentY += 20;

  // Order Summary Section
  const summaryStartX = pageWidth - 80;
  const summaryWidth = 65;
  
  // Summary background
  doc.setFillColor(248, 249, 250);
  doc.rect(summaryStartX, currentY, summaryWidth, 55, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.rect(summaryStartX, currentY, summaryWidth, 55);
  
  // Summary title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text('ORDER SUMMARY', summaryStartX + 5, currentY + 8);
  
  // Summary items
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  
  let summaryY = currentY + 18;
  const summaryItems = [
    { label: 'Subtotal:', value: `${orderSummary?.subtotal?.toLocaleString() || '0'} XAF` },
    { label: 'Shipping:', value: orderSummary?.shipping === 0 ? 'Free' : `${orderSummary?.shipping?.toLocaleString() || '0'} XAF` },
    { label: 'Tax (VAT):', value: `${orderSummary?.tax?.toLocaleString() || '0'} XAF` }
  ];
  
  if (orderSummary?.processingFee > 0) {
    summaryItems.push({ label: 'Processing Fee:', value: `${orderSummary.processingFee.toLocaleString()} XAF` });
  }
  
  summaryItems.forEach(item => {
    doc.text(item.label, summaryStartX + 5, summaryY);
    doc.text(item.value, summaryStartX + summaryWidth - 5, summaryY, { align: 'right' });
    summaryY += 6;
  });
  
  // Total line
  doc.setDrawColor(200, 200, 200);
  doc.line(summaryStartX + 5, summaryY, summaryStartX + summaryWidth - 5, summaryY);
  summaryY += 8;
  
  // Total amount
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(231, 166, 8);
  doc.text('TOTAL:', summaryStartX + 5, summaryY);
  doc.text(`${orderSummary?.total?.toLocaleString() || '0'} XAF`, summaryStartX + summaryWidth - 5, summaryY, { align: 'right' });
  
  currentY += 75;

  // Payment Method Section
  if (selectedPaymentMethod) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text('PAYMENT METHOD', 15, currentY);
    
    currentY += 10;
    
    // Payment method box
    doc.setFillColor(252, 252, 252);
    doc.rect(15, currentY, pageWidth - 30, 25, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(15, currentY, pageWidth - 30, 25);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.text(selectedPaymentMethod.name || 'Cash on Delivery', 20, currentY + 8);
    
    if (selectedPaymentMethod.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(selectedPaymentMethod.description, 20, currentY + 16);
    }
    
    currentY += 35;
  }

  // Footer Section
  const footerY = pageHeight - 40;
  
  // Footer background
  doc.setFillColor(60, 60, 60);
  doc.rect(0, footerY, pageWidth, 40, 'F');
  
  // Footer content
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Thank you for choosing BraidSter!', 15, footerY + 12);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text('For support and inquiries: support@braidster.com | +237 XXX XXX XXX', 15, footerY + 20);
  doc.text('BraidSter - Your trusted hair & beauty commerce platform', 15, footerY + 28);
  
  // Terms note
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('Terms and conditions apply. Visit braidster.com for more information.', 15, footerY + 35);

  return doc;
};

// Enhanced download function with custom logo path option
export const downloadBraidSterInvoice = async (orderData, options = {}) => {
  try {
    const doc = await generateBraidSterInvoice(orderData, options.logoPath);
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `BraidSter-Invoice-${orderData.orderNumber}-${timestamp}.pdf`;
    doc.save(fileName);
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating invoice:', error);
    return { success: false, error: error.message };
  }
};

// Function to email invoice (requires backend integration)
export const emailBraidSterInvoice = async (orderData, emailOptions = {}) => {
  try {
    const doc = await generateBraidSterInvoice(orderData);
    const pdfBlob = doc.output('blob');
    
    // This would typically send to your backend API
    const formData = new FormData();
    formData.append('pdf', pdfBlob, `BraidSter-Invoice-${orderData.orderNumber}.pdf`);
    formData.append('to', emailOptions.to || orderData.customerInfo.email);
    formData.append('subject', emailOptions.subject || `Your BraidSter Invoice #${orderData.orderNumber}`);
    formData.append('orderNumber', orderData.orderNumber);
    
    // Replace with your actual API endpoint
    // const response = await fetch('/api/send-invoice', {
    //   method: 'POST',
    //   body: formData
    // });
    
    console.log('Invoice prepared for email sending');
    return { success: true, message: 'Invoice prepared for email' };
  } catch (error) {
    console.error('Error preparing invoice for email:', error);
    return { success: false, error: error.message };
  }
};

// Preview function for displaying in browser
export const previewBraidSterInvoice = async (orderData) => {
  try {
    const doc = await generateBraidSterInvoice(orderData);
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl, '_blank');
    return { success: true };
  } catch (error) {
    console.error('Error previewing invoice:', error);
    return { success: false, error: error.message };
  }
};