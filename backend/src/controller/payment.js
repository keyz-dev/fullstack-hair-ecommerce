const Order = require('../models/order');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const campayService = require('../utils/campay');
const { validatePhoneNumber, normalizePhoneNumber } = require('../utils/phoneValidation');
const { initiatePaymentSchema } = require('../schema/paymentSchema');
const { 
  addActivePayment, 
  updatePaymentStatus, 
  notifyPaymentUpdate, 
  getPaymentInfo,
  removeActivePayment 
} = require('../sockets/payment');

// Initiate payment for an order
exports.initiatePayment = async (req, res, next) => {
  try {
    // Validate request body using schema
    const { error } = initiatePaymentSchema.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }

    const { orderId, phoneNumber } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new NotFoundError('Order not found'));
    }

    if (order.paymentStatus === 'paid') {
      return next(new BadRequestError('Order already paid'));
    }

    // Normalize phone number to E.164 format
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    const paymentData = {
      // amount: Math.round(order.totalAmount), // Ensure integer amount
      amount: 2, // TODO: Remove this For real account
      phoneNumber: normalizedPhone,
      description: `Payment for BraidSter order #${orderId.slice(-8)}`,
      orderId: orderId,
      currency: 'XAF'
    };

    const paymentResponse = await campayService.initiatePayment(paymentData);
    
    // Update order with payment details (don't override paymentMethod)
    order.paymentStatus = 'pending';
    order.paymentReference = paymentResponse.reference;
    await order.save();

    // Add payment to active tracking for real-time updates
    await addActivePayment(paymentResponse.reference, {
      orderId: orderId,
      amount: paymentData.amount,
      phoneNumber: normalizedPhone,
      description: paymentData.description,
      userId: req.user?.id || null,
      campayReference: paymentResponse.reference
    });

    // Notify connected clients that payment was initiated
    if (global.io) {
      global.io.to(`payment-${paymentResponse.reference}`).emit('payment-initiated', {
        reference: paymentResponse.reference,
        campayReference: paymentResponse.reference,
        amount: paymentData.amount,
        phoneNumber: normalizedPhone,
        description: paymentData.description,
        status: 'PENDING',
        message: 'Payment request sent to user. Waiting for response.',
        timestamp: new Date()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully. Please check your phone for the payment prompt.',
      paymentReference: paymentResponse.reference,
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    next(new BadRequestError('Payment initiation failed: ' + error.message));
  }
};

// Campay webhook with Socket.IO integration
exports.handleWebhook = async (req, res, next) => {
  try {
    console.log("\n======================")
    console.log('🎯 Webhook received and verified', req.body);
    console.log("\n======================")
    
    const {
      status,
      reference,
      amount,
      currency,
      operator,
      phone_number,
      external_reference,
      code,
      operator_reference
    } = req.body;

    // Find the payment in our storage
    let paymentInfo = null;
    let ourReference = external_reference || reference;

    // Look for payment by external_reference first, then by campay reference
    if (external_reference) {
      paymentInfo = await getPaymentInfo(external_reference);
      if (paymentInfo) {
        ourReference = external_reference;
      }
    }
    
    // If not found by external_reference, try to find by campay reference in orders
    if (!paymentInfo) {
      const order = await Order.findOne({ paymentReference: reference });
      if (order) {
        paymentInfo = {
          reference: order.paymentReference,
          status: order.paymentStatus,
          amount: order.totalAmount,
          orderId: order._id
        };
        ourReference = order.paymentReference;
      }
    }

    if (!paymentInfo) {
      console.warn(`⚠️  Payment not found in active payments: ${reference}`);
      // Still process and emit, might be a delayed webhook
      ourReference = reference;
      paymentInfo = {
        reference: reference,
        status: status,
        amount: amount,
        phoneNumber: phone_number,
        operator: operator
      };
    }

    // Update payment status in tracking
    await updatePaymentStatus(ourReference, status, {
      operator: operator,
      campayCode: code,
      operatorReference: operator_reference
    });

    // Update order in database
    const order = await Order.findById(external_reference);
    if (order) {
      // Update order status based on payment status
      let orderStatus = 'pending';
      let paymentStatus = 'pending';

      switch (status) {
        case 'SUCCESSFUL':
          paymentStatus = 'paid';
          orderStatus = 'accepted';
          order.paymentTime = new Date();
          break;
        case 'FAILED':
          paymentStatus = 'failed';
          orderStatus = 'cancelled';
          break;
        case 'CANCELLED':
          paymentStatus = 'failed';
          orderStatus = 'cancelled';
          break;
        case 'PENDING':
          paymentStatus = 'pending';
          orderStatus = 'pending';
          break;
        default:
          paymentStatus = 'pending';
          orderStatus = 'pending';
      }

      // Update order
      order.paymentStatus = paymentStatus;
      order.status = orderStatus;
      order.paymentReference = reference;
      
      // Verify amount matches
      if (amount && parseFloat(amount) !== order.totalAmount) {
        console.warn(`Amount mismatch: webhook ${amount}, order ${order.totalAmount}`);
      }

      await order.save();
      console.log(`Order ${external_reference} updated with status: ${order.paymentStatus}`);
    }

    // Prepare notification data
    const notificationData = {
      reference: ourReference,
      campayReference: reference,
      status: status,
      amount: amount,
      currency: currency,
      phoneNumber: phone_number,
      operator: operator,
      campayCode: code,
      operatorReference: operator_reference,
      timestamp: new Date(),
      message: status === 'SUCCESSFUL' 
        ? 'Payment completed successfully!' 
        : 'Payment failed or was cancelled',
      shouldStopPolling: status === 'SUCCESSFUL' || status === 'FAILED' || status === 'CANCELLED'
    };

    // Send real-time notifications via Socket.IO
    if (global.io) {
      notifyPaymentUpdate(global.io, ourReference, notificationData);
    }

    // Remove payment from active tracking if completed
    if (status === 'SUCCESSFUL' || status === 'FAILED') {
      await removeActivePayment(ourReference);
    }

    // Log active connections for debugging
    if (global.io) {
      const roomName = `payment-${ourReference}`;
      const clientsInRoom = global.io.sockets.adapter.rooms.get(roomName);
      console.log(`🔍 Debug info:`);
      console.log(`   Clients in room ${roomName}: ${clientsInRoom ? clientsInRoom.size : 0}`);
    }
    
    res.status(200).json({
      received: true,
      verified: true,
      reference: ourReference,
      processedAt: new Date()
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Check payment status manually
exports.checkPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new NotFoundError('Order not found'));
    }

    if (!order.paymentReference) {
      return next(new BadRequestError('No payment reference found'));
    }

    // Get latest status from Campay
    const paymentStatus = await campayService.checkPaymentStatus(order.paymentReference);
    
    // Update order based on current status if it has changed
    let orderUpdated = false;
    let shouldStopPolling = false;
    
    if (paymentStatus.status === 'SUCCESSFUL' && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.paymentTime = new Date();
      order.status = 'accepted';
      orderUpdated = true;
      shouldStopPolling = true;
    } else if (paymentStatus.status === 'FAILED' && order.paymentStatus !== 'failed') {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      orderUpdated = true;
      shouldStopPolling = true;
    } else if (paymentStatus.status === 'CANCELLED' && order.paymentStatus !== 'failed') {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      orderUpdated = true;
      shouldStopPolling = true;
    }

    if (orderUpdated) {
      await order.save();
      console.log(`Order ${orderId} updated via status check: ${order.paymentStatus}`);
      
      // Update payment tracking service and notify frontend
      await updatePaymentStatus(order.paymentReference, paymentStatus.status, {
        operator: paymentStatus.operator || 'Unknown',
        campayCode: paymentStatus.code,
        operatorReference: paymentStatus.operator_reference
      });
      
      // Send real-time notification to frontend
      if (global.io) {
        const notificationData = {
          reference: order.paymentReference,
          campayReference: order.paymentReference,
          status: paymentStatus.status,
          amount: order.totalAmount,
          currency: 'XAF',
          phoneNumber: order.guestInfo?.phone || 'Unknown',
          operator: paymentStatus.operator || 'Unknown',
          campayCode: paymentStatus.code,
          operatorReference: paymentStatus.operator_reference,
          timestamp: new Date(),
          message: `Payment ${paymentStatus.status.toLowerCase()}`,
          shouldStopPolling: shouldStopPolling
        };
        
        notifyPaymentUpdate(global.io, order.paymentReference, notificationData);
      }
    }

    res.status(200).json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        status: order.status,
        paymentTime: order.paymentTime
      },
      campayStatus: paymentStatus,
      updated: orderUpdated,
      shouldStopPolling: shouldStopPolling
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    next(new BadRequestError('Failed to check payment status: ' + error.message));
  }
};

// Get payment status from active tracking
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { reference } = req.params;
    
    const paymentInfo = await getPaymentInfo(reference);
    
    if (!paymentInfo) {
      return res.status(404).json({
        error: 'Payment not found',
        reference: reference
      });
    }

    res.json({
      reference: reference,
      status: paymentInfo.status,
      amount: paymentInfo.amount,
      phoneNumber: paymentInfo.phoneNumber,
      description: paymentInfo.description,
      createdAt: paymentInfo.createdAt,
      lastUpdated: paymentInfo.lastUpdated,
      campayReference: paymentInfo.campayReference,
      operator: paymentInfo.operator
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    next(new BadRequestError('Failed to get payment status: ' + error.message));
  }
};

// Debug endpoint - see active connections
exports.getDebugInfo = async (req, res, next) => {
  try {
    if (!global.io) {
      return res.status(503).json({ error: 'Socket.IO not available' });
    }

    const { getDebugInfo } = require('../sockets/payment');
    const debugInfo = await getDebugInfo(global.io);

    res.json(debugInfo);
  } catch (error) {
    console.error('Debug info error:', error);
    next(new BadRequestError('Failed to get debug info: ' + error.message));
  }
};

