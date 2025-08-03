const camPayService = require('../services/campay');
const { paymentTrackingService } = require('./index')
const logger = require('../utils/logger');

exports.startPolling = (paymentReference) => {
  const pollInterval = 10000; // 30 seconds
  const maxPollTime = 600000; // 10 minutes
  const startTime = Date.now();

  // start polling after 2 minutes
  const pollDelay = 5000;

  const poll = async () => {

    try {
      const payment = paymentTrackingService.getPaymentInfo(paymentReference);
      
      // Stop polling if payment is completed or expired
      if (!payment || 
          payment.status === 'SUCCESSFUL' || 
          payment.status === 'FAILED' || 
          payment.status === 'CANCELLED' ||
          Date.now() - startTime > maxPollTime) {
        logger.info(`Stopping polling for payment ${paymentReference}`);
        return;
      }

      const statusResponse = await camPayService.checkPaymentStatus(paymentReference);
      
      if (statusResponse.status) {
        const newStatus = statusResponse.status;
        
        if (newStatus !== payment.status) {
          payment.status = newStatus;
          
          if (newStatus === 'SUCCESSFUL' || newStatus === 'FAILED') {
            payment.completedAt = new Date().toISOString();
          }
          
          paymentTrackingService.updatePaymentStatus(paymentReference, newStatus);

          // Notify clients
          io.to(`payment-room-for-${paymentReference}`).emit('payment-status-update', {
            paymentReference,
            status: newStatus,
            message: newStatus === 'SUCCESSFUL' 
              ? 'Payment completed successfully!' 
              : newStatus === 'FAILED' 
                ? 'Payment failed. Please try again.' 
                : 'Payment status updated',
            completedAt: payment.completedAt
          });
        }
      }

      // Continue polling if payment is still pending
      if (payment.status === 'PENDING') {
        setTimeout(poll, pollInterval);
      }
    } catch (error) {
      logger.error(`Polling error for payment of this order... ${paymentReference}:`, error);
      setTimeout(poll, pollInterval); // Continue polling despite errors
    }
  };

  // Start polling after a short delay
  setTimeout(poll, pollDelay);
}

// Update payment status using Order model
exports.updatePaymentStatus = async (paymentReference, status, additionalData = {}) => {
  try {
    const result = await paymentTrackingService.updatePaymentStatus(paymentReference, status, additionalData);
    if (result) {
      logger.info(`📊 Payment status updated: ${paymentReference} -> ${status}`);
      return result;
    }
    return null;
  } catch (error) {
    logger.error('Error updating payment status:', error);
    return null;
  }
}

// Get payment info from Order model
exports.getPaymentInfo = async (paymentReference) => {
  try {
    return await paymentTrackingService.getPaymentInfo(paymentReference);
  } catch (error) {
    logger.error('Error getting payment info:', error);
    return null;
  }
}

exports.notifyPaymentUpdate = (io, paymentReference, notificationData) => {
  const roomName = `payment-room-for-${paymentReference}`;

  if (notificationData.status === "SUCCESSFUL") {
    // Emit success event
    io.to(roomName).emit("payment-success", notificationData);

    // Also emit general payment-completed event
    io.to(roomName).emit("payment-completed", {
      ...notificationData,
      success: true,
    });
  } else if (notificationData.status === "FAILED") {
    // Emit failure event
    io.to(roomName).emit("payment-failed", notificationData);

    // Also emit general payment-completed event
    io.to(roomName).emit("payment-completed", {
      ...notificationData,
      success: false,
    });
  } else if (notificationData.status === "CANCELLED") {
    // Emit cancellation event
    io.to(roomName).emit("payment-cancelled", notificationData);

    // Also emit general payment-completed event
    io.to(roomName).emit("payment-completed", {
      ...notificationData,
      success: false,
    });
  }

  // Always emit status update
  io.to(roomName).emit("payment-status", notificationData);
  
  // If shouldStopPolling is true, emit a specific event to stop frontend polling
  if (notificationData.shouldStopPolling) {
    io.to(roomName).emit("payment-polling-stopped", {
      reference: paymentReference,
      reason: `Payment ${notificationData.status.toLowerCase()}`,
      timestamp: new Date()
    });
  }
} 