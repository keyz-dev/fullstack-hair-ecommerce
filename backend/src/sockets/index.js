const { Server } = require('socket.io');
const Order = require('../models/order');
require('dotenv').config();

// In-memory storage for connected clients (lightweight)
const connectedClients = new Map();

// Socket.IO setup function
function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*", // In production, replace with your actual domain
      methods: ["GET", "POST"],
    },
  });

  // Store io instance for use in payment tracking service
  paymentTrackingService.io = io;

  // ===================================================================
  // SOCKET.IO CONNECTION HANDLING
  // ===================================================================

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    
    // Store client connection
    connectedClients.set(socket.id, {
      connectedAt: new Date(),
      userId: null, // Will be set when user authenticates
      activePayments: new Set()
    });

    // Handle client joining a payment room
    socket.on('track-payment', async (data) => {
      const { paymentReference, userId } = data;
      
      console.log(`👤 Client ${socket.id} tracking payment: ${paymentReference}`);
      
      // Join a room specific to this payment
      socket.join(`payment-${paymentReference}`);
      
      // Update client info
      const clientInfo = connectedClients.get(socket.id);
      if (clientInfo) {
        clientInfo.userId = userId;
        clientInfo.activePayments.add(paymentReference);
      }
      
      try {
        // Get payment status from Order model
        const order = await Order.findOne({ paymentReference });
        
        if (order) {
          socket.emit('payment-status', {
            reference: paymentReference,
            status: order.paymentStatus.toUpperCase(),
            amount: order.totalAmount,
            timestamp: order.updatedAt,
            orderNumber: order.orderNumber
          });
        } else {
          // Payment not found, might still be PENDING
          socket.emit('payment-status', {
            reference: paymentReference,
            status: 'PENDING',
            message: 'Payment request initiated, waiting for user response'
          });
        }
      } catch (error) {
        console.error('Error fetching payment status:', error);
        socket.emit('payment-status', {
          reference: paymentReference,
          status: 'ERROR',
          message: 'Unable to fetch payment status'
        });
      }
    });

    // Handle client stopping payment tracking
    socket.on('stop-tracking-payment', (data) => {
      const { paymentReference } = data;
      console.log(`🛑 Client ${socket.id} stopped tracking payment: ${paymentReference}`);
      
      socket.leave(`payment-${paymentReference}`);
      
      const clientInfo = connectedClients.get(socket.id);
      if (clientInfo) {
        clientInfo.activePayments.delete(paymentReference);
      }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      connectedClients.delete(socket.id);
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
        console.log(`📊 Payment status updated in Order: ${paymentReference} -> ${status}`);
        
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
      console.error('Error updating payment status:', error);
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
      console.error('Error fetching payment info:', error);
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
      console.error('Error fetching active payments:', error);
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
  connectedClients,
  paymentTrackingService
}; 