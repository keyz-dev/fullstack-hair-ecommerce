// server.js - Complete Backend Implementation
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage (use Redis or database in production)
const paymentSessions = new Map();
const activeConnections = new Map();

const camPayService = new CamPayService();

// Socket.IO Connection Management
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Client joins a payment session
  socket.on('join-payment-session', (paymentId) => {
    socket.join(paymentId);
    activeConnections.set(socket.id, paymentId);
    console.log(`Client ${socket.id} joined payment session: ${paymentId}`);
  });

  // Client leaves payment session
  socket.on('leave-payment-session', (paymentId) => {
    socket.leave(paymentId);
    activeConnections.delete(socket.id);
    console.log(`Client ${socket.id} left payment session: ${paymentId}`);
  });

  socket.on('disconnect', () => {
    const paymentId = activeConnections.get(socket.id);
    if (paymentId) {
      activeConnections.delete(socket.id);
    }
    console.log('Client disconnected:', socket.id);
  });
});

// API Routes

// 1. Initiate Payment
app.post('/api/payments/initiate', async (req, res) => {
  try {
    const { amount, phoneNumber, description, userId } = req.body;

    // Validation
    if (!amount || !phoneNumber || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, phoneNumber, description'
      });
    }

    // Validate phone number format (should start with country code)
    if (!phoneNumber.match(/^237[67]\d{8}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format. Should be 237XXXXXXXXX'
      });
    }

    // Validate amount (should be integer)
    if (!Number.isInteger(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive integer'
      });
    }

    const paymentId = generatePaymentId();
    
    const paymentData = {
      paymentId,
      amount: Number(amount),
      phoneNumber,
      description,
      userId,
      status: 'INITIATING',
      createdAt: new Date().toISOString()
    };

    // Store payment session
    paymentSessions.set(paymentId, paymentData);

    // Send request to CamPay
    const camPayResponse = await camPayService.requestPayment(paymentData);

    if (camPayResponse.success) {
      // Update payment session with CamPay reference
      paymentData.status = 'PENDING';
      paymentData.campayReference = camPayResponse.reference;
      paymentSessions.set(paymentId, paymentData);

      // Notify connected clients
      io.to(paymentId).emit('payment-status-update', {
        paymentId,
        status: 'PENDING',
        message: 'Payment request sent. Please check your phone for the payment prompt.'
      });

      // Start polling for status updates (as backup to webhook)
      startPolling(paymentId, camPayResponse.reference);

      res.json({
        success: true,
        paymentId,
        status: 'PENDING',
        reference: camPayResponse.reference,
        message: 'Payment initiated successfully. Check your phone for the payment prompt.'
      });
    } 
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// 2. Get Payment Status
app.get('/api/payments/:paymentId/status', (req, res) => {
  const { paymentId } = req.params;
  const payment = paymentSessions.get(paymentId);

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: 'Payment not found'
    });
  }

  res.json({
    success: true,
    paymentId,
    status: payment.status,
    amount: payment.amount,
    phoneNumber: payment.phoneNumber,
    description: payment.description,
    createdAt: payment.createdAt,
    completedAt: payment.completedAt,
    campayReference: payment.campayReference,
    error: payment.error,
    errorCode: payment.errorCode
  });
});

// 3. Webhook Handler - Primary method for receiving status updates
app.post('/api/webhooks/campay', (req, res) => {
  try {
    console.log('Webhook received:', req.body);

    // Validate webhook signature (optional but recommended)
    const signature = req.headers['x-campay-signature'] || req.body.signature;
    if (signature && CAMPAY_CONFIG.webhookSecret) {
      if (!validateWebhookSignature(req.body, signature)) {
        console.log('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const {
      status,
      reference,
      amount,
      currency,
      operator,
      code,
      operator_reference,
      external_reference,
      external_user,
      phone_number,
      endpoint
    } = req.body;

    // Find payment by external_reference (our paymentId)
    const paymentId = external_reference;
    const payment = paymentSessions.get(paymentId);

    if (!payment) {
      console.log('Payment not found for webhook:', paymentId);
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update payment status
    payment.status = status;
    payment.completedAt = new Date().toISOString();
    payment.operatorReference = operator_reference;
    payment.campayCode = code;
    payment.operator = operator;

    if (status === 'FAILED') {
      payment.error = 'Payment failed';
    }

    paymentSessions.set(paymentId, payment);

    // Notify connected clients via Socket.IO
    const updateData = {
      paymentId,
      status,
      amount,
      currency,
      operator,
      completedAt: payment.completedAt
    };

    if (status === 'SUCCESSFUL') {
      updateData.message = 'Payment completed successfully!';
    } else if (status === 'FAILED') {
      updateData.message = 'Payment failed. Please try again.';
      updateData.error = payment.error;
    }

    io.to(paymentId).emit('payment-status-update', updateData);

    console.log(`Payment ${paymentId} status updated to: ${status}`);

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// 4. Manual Status Check (for debugging)
app.post('/api/payments/:paymentId/check-status', async (req, res) => {
  const { paymentId } = req.params;
  const payment = paymentSessions.get(paymentId);

  if (!payment || !payment.campayReference) {
    return res.status(404).json({
      success: false,
      error: 'Payment not found or no CamPay reference'
    });
  }

  const statusResponse = await camPayService.checkTransactionStatus(payment.campayReference);

  if (statusResponse.success) {
    // Update local payment data
    const campayData = statusResponse.data;
    payment.status = campayData.status || payment.status;
    
    if (campayData.status === 'SUCCESSFUL' || campayData.status === 'FAILED') {
      payment.completedAt = new Date().toISOString();
    }

    paymentSessions.set(paymentId, payment);

    // Notify clients
    io.to(paymentId).emit('payment-status-update', {
      paymentId,
      status: payment.status,
      data: campayData
    });

    res.json({
      success: true,
      status: payment.status,
      campayData
    });
  } else {
    res.status(500).json({
      success: false,
      error: statusResponse.error
    });
  }
});

// Polling Service - Backup method for status checking
function startPolling(paymentId, campayReference) {
  const pollInterval = 5000; // 5 seconds
  const maxPollTime = 300000; // 5 minutes
  const startTime = Date.now();

  const poll = async () => {
    try {
      const payment = paymentSessions.get(paymentId);
      
      // Stop polling if payment is completed or expired
      if (!payment || 
          payment.status === 'SUCCESSFUL' || 
          payment.status === 'FAILED' ||
          Date.now() - startTime > maxPollTime) {
        console.log(`Stopping polling for payment ${paymentId}`);
        return;
      }

      const statusResponse = await camPayService.checkTransactionStatus(campayReference);
      
      if (statusResponse.success && statusResponse.data.status) {
        const newStatus = statusResponse.data.status;
        
        if (newStatus !== payment.status) {
          payment.status = newStatus;
          
          if (newStatus === 'SUCCESSFUL' || newStatus === 'FAILED') {
            payment.completedAt = new Date().toISOString();
          }
          
          paymentSessions.set(paymentId, payment);

          // Notify clients
          io.to(paymentId).emit('payment-status-update', {
            paymentId,
            status: newStatus,
            message: newStatus === 'SUCCESSFUL' 
              ? 'Payment completed successfully!' 
              : newStatus === 'FAILED' 
                ? 'Payment failed. Please try again.' 
                : 'Payment status updated',
            completedAt: payment.completedAt
          });

          console.log(`Polling: Payment ${paymentId} status updated to: ${newStatus}`);
        }
      }

      // Continue polling if payment is still pending
      if (payment.status === 'PENDING') {
        setTimeout(poll, pollInterval);
      }
    } catch (error) {
      console.error(`Polling error for payment ${paymentId}:`, error);
      setTimeout(poll, pollInterval); // Continue polling despite errors
    }
  };

  // Start polling after a short delay
  setTimeout(poll, 2000);
}

// Webhook signature validation (optional security measure)
function validateWebhookSignature(payload, signature) {
  try {
    // CamPay sends JWT signatures
    const decoded = jwt.verify(signature, CAMPAY_CONFIG.webhookSecret);
    return true;
  } catch (error) {
    console.error('Webhook signature validation failed:', error);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CamPay Payment Service is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/api/webhooks/campay`);
});