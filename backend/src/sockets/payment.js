const { connectedClients, paymentTrackingService } = require("./index");

// ===================================================================
// PAYMENT TRACKING FUNCTIONS
// ===================================================================

// Add payment to active tracking (now handled by Order model)
async function addActivePayment(paymentReference, paymentData) {
  try {
    // The payment is already stored in the Order model when initiated
    // This function now just logs the tracking start
    console.log(`💳 Payment added to tracking: ${paymentReference}`);
    return true;
  } catch (error) {
    console.error('Error adding payment to tracking:', error);
    return false;
  }
}

// Update payment status using Order model
async function updatePaymentStatus(paymentReference, status, additionalData = {}) {
  try {
    const result = await paymentTrackingService.updatePaymentStatus(paymentReference, status, additionalData);
    if (result) {
      console.log(`📊 Payment status updated: ${paymentReference} -> ${status}`);
      return result;
    }
    return null;
  } catch (error) {
    console.error('Error updating payment status:', error);
    return null;
  }
}

// Get payment info from Order model
async function getPaymentInfo(paymentReference) {
  try {
    return await paymentTrackingService.getPaymentInfo(paymentReference);
  } catch (error) {
    console.error('Error getting payment info:', error);
    return null;
  }
}

// Remove payment from tracking (after completion)
async function removeActivePayment(paymentReference) {
  try {
    // In the new system, payments are not removed from the Order model
    // They remain as a record. This function now just logs the completion
    console.log(`🗑️ Payment completed and removed from active tracking: ${paymentReference}`);
    return true;
  } catch (error) {
    console.error('Error removing payment from tracking:', error);
    return false;
  }
}

// ===================================================================
// NOTIFICATION FUNCTIONS
// ===================================================================

function notifyPaymentUpdate(io, paymentReference, notificationData) {
  const roomName = `payment-${paymentReference}`;
  const clientsInRoom = io.sockets.adapter.rooms.get(roomName);

  console.log(`📡 Emitting to room: ${roomName}`);
  console.log(`👥 Clients in room: ${clientsInRoom ? clientsInRoom.size : 0}`);

  if (notificationData.status === "SUCCESSFUL") {
    // Emit success event
    io.to(roomName).emit("payment-success", notificationData);
    console.log("✅ Payment success notification sent");

    // Also emit general payment-completed event
    io.to(roomName).emit("payment-completed", {
      ...notificationData,
      success: true,
    });
  } else if (notificationData.status === "FAILED") {
    // Emit failure event
    io.to(roomName).emit("payment-failed", notificationData);
    console.log("❌ Payment failure notification sent");

    // Also emit general payment-completed event
    io.to(roomName).emit("payment-completed", {
      ...notificationData,
      success: false,
    });
  } else if (notificationData.status === "CANCELLED") {
    // Emit cancellation event
    io.to(roomName).emit("payment-cancelled", notificationData);
    console.log("❌ Payment cancellation notification sent");

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
    console.log(`🛑 Emitted polling stopped event for ${paymentReference}`);
  }
}

// ===================================================================
// DEBUG FUNCTIONS
// ===================================================================

async function getDebugInfo(io) {
  try {
    const connections = Array.from(connectedClients.entries()).map(
      ([socketId, info]) => ({
        socketId,
        userId: info.userId,
        connectedAt: info.connectedAt,
        activePayments: Array.from(info.activePayments),
      })
    );

    const payments = await paymentTrackingService.getAllActivePayments();

    return {
      connectedClients: connections.length,
      activePayments: payments.length,
      connections: connections,
      payments: payments,
      rooms: Object.keys(io.sockets.adapter.rooms),
    };
  } catch (error) {
    console.error('Error getting debug info:', error);
    return {
      connectedClients: 0,
      activePayments: 0,
      connections: [],
      payments: [],
      rooms: [],
      error: error.message
    };
  }
}

module.exports = {
  addActivePayment,
  updatePaymentStatus,
  getPaymentInfo,
  removeActivePayment,
  notifyPaymentUpdate,
  getDebugInfo,
};
