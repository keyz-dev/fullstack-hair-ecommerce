const { Server } = require('socket.io');
const Order = require('../models/order');
require('dotenv').config();
const logger = require('../utils/logger');

// In-memory storage for connected clients (lightweight)
const connectedClients = new Map();
const paymentSession = new Map();

// Socket.IO setup function
function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  paymentTrackingService.io = io;

  io.on('connection', (socket) => {
        logger.info(`🔌 Client connected to the main socket service: ${socket.id}`);

    // Handle client joining a payment room
    socket.on('track-payment', async (paymentReference) => {
            logger.info(`👤 Client ${socket.id} tracking payment: ${paymentReference}`);            
      // Join a room specific to this payment
      socket.join(`payment-room-for-${paymentReference}`);
      connectedClients.set(socket.id, paymentReference);
    });

    // Handle client stopping payment tracking
    socket.on('stop-tracking-payment', (paymentReference) => {
            logger.info(`🛑 Client ${socket.id} stopped tracking payment: ${paymentReference}`);
      socket.leave(`payment-room-for-${paymentReference}`);
      connectedClients.delete(socket.id);
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
      const paymentReference = connectedClients.get(socket.id);
      if (paymentReference) {
        socket.leave(`payment-room-for-${paymentReference}`);
        connectedClients.delete(socket.id);
      }
            logger.info(`🔌 Client disconnected: ${socket.id}`);
    });

    // Send connection acknowledgment
    socket.emit('connected', {
      message: 'Connected to payment notifications',
      socketId: socket.id,
      timestamp: new Date()
    });
  });

  return io;
}

// Payment tracking methods using Order model
const paymentTrackingService = {
  // Update payment status in Order model
  async updatePaymentStatus(paymentReference, status, additionalData = {}) {
    try {
      const updateData = {
        paymentStatus: status.toLowerCase(),
        ...additionalData
      };

      if (status.toLowerCase() === 'paid') {
        updateData.paymentTime = new Date();
      }

      const order = await Order.findOneAndUpdate(
        { paymentReference },
        updateData,
        { new: true }
      );

      if (order) {
                logger.info(`📊 Payment status updated in Order: ${paymentReference} -> ${status}`);
        
        // Emit to all clients tracking this payment
        if (this.io) {
          this.io.to(`payment-${paymentReference}`).emit('payment-status', {
            reference: paymentReference,
            status: status.toUpperCase(),
            amount: order.totalAmount,
            timestamp: order.updatedAt,
            orderNumber: order.orderNumber
          });
        }
        
        return order;
      }
      return null;
    } catch (error) {
            logger.error('Error updating payment status:', error);
      return null;
    }
  },

  // Get payment info from Order model
  async getPaymentInfo(paymentReference) {
    try {
      const order = await Order.findOne({ paymentReference });
      if (order) {
        return {
          reference: paymentReference,
          status: order.paymentStatus,
          amount: order.totalAmount,
          orderNumber: order.orderNumber,
          createdAt: order.createdAt,
          lastUpdated: order.updatedAt
        };
      }
      return null;
    } catch (error) {
            logger.error('Error fetching payment info:', error);
      return null;
    }
  },

  // Get all active payments (pending payments)
  async getAllActivePayments() {
    try {
      const orders = await Order.find({ 
        paymentStatus: 'pending',
        paymentReference: { $ne: '' }
      }).select('paymentReference paymentStatus totalAmount orderNumber createdAt updatedAt');
      
      return orders.map(order => ({
        reference: order.paymentReference,
        status: order.paymentStatus,
        amount: order.totalAmount,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        lastUpdated: order.updatedAt
      }));
    } catch (error) {
            logger.error('Error fetching active payments:', error);
      return [];
    }
  },

  // Get connected clients info
  getAllConnectedClients() {
    const clients = [];
    for (const [socketId, clientInfo] of connectedClients.entries()) {
      clients.push({
        socketId,
        userId: clientInfo.userId,
        connectedAt: clientInfo.connectedAt,
        activePayments: Array.from(clientInfo.activePayments)
      });
    }
    return clients;
  }
};

module.exports = {
  setupSocketIO,
  paymentSession,
  connectedClients,
  paymentTrackingService
}; 