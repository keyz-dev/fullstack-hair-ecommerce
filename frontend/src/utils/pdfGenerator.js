import jsPDF from 'jspdf';
import { addBraidSterLogo, addProductImage } from './pdf';

export const generateBraidSterInvoice = async (orderData, customLogoPath = null) => {
  const {
    orderNumber,
    customerInfo,
    shippingAddress,
    orderSummary,
    selectedPaymentMethod,
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

  // Header Section
  const headerHeight = 40;
  
  // Header background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');
  
  // Add logo
  await addBraidSterLogo(doc, 15, 10, 40, 20, customLogoPath);
  
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
    await addProductImage(doc, productImageUrl, 20, currentY + 5, 25, 25);
    
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