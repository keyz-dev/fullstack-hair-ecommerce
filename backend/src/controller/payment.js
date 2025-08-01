const Order = require('../models/order');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const campayService = require('../utils/campay');
const { validatePhoneNumber, normalizePhoneNumber } = require('../utils/phoneValidation');
const { initiatePaymentSchema } = require('../schema/paymentSchema');

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

    console.log('Processing payment for order:', orderId, 'Amount:', paymentData.amount);

    const paymentResponse = await campayService.initiatePayment(paymentData);
    
    // Update order with payment details (don't override paymentMethod)
    order.paymentStatus = 'pending';
    order.paymentReference = paymentResponse.reference;
    await order.save();

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

// Campay webhook
exports.handleWebhook = async (req, res, next) => {
  try {
    console.log('Received webhook:', req.body);
    
    const { reference, status, external_reference, amount } = req.body;
    
    if (!external_reference || !status) {
      return res.status(400).json({ error: 'Missing required webhook data' });
    }

    const order = await Order.findById(external_reference);
    if (!order) {
      console.error('Order not found for webhook:', external_reference);
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`Processing webhook for order ${external_reference}: ${status}`);

    if (status === 'SUCCESSFUL') {
      order.paymentStatus = 'paid';
      order.paymentTime = new Date();
      order.status = 'confirmed';
      order.paymentReference = reference;
      
      // Verify amount matches
      if (amount && parseFloat(amount) !== order.totalAmount) {
        console.warn(`Amount mismatch: webhook ${amount}, order ${order.totalAmount}`);
      }
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
    } else if (status === 'PENDING') {
      order.paymentStatus = 'pending';
    }

    await order.save();
    
    console.log(`Order ${external_reference} updated with status: ${order.paymentStatus}`);
    
    res.status(200).json({ success: true, message: 'Webhook processed successfully' });
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

    const paymentStatus = await campayService.checkPaymentStatus(order.paymentReference);
    
    // Update order based on current status
    if (paymentStatus.status === 'SUCCESSFUL' && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.paymentTime = new Date();
      order.status = 'confirmed';
      await order.save();
    } else if (paymentStatus.status === 'FAILED' && order.paymentStatus !== 'failed') {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
      await order.save();
    }

    res.status(200).json({
      success: true,
      order: {
        id: order._id,
        paymentStatus: order.paymentStatus,
        status: order.status
      },
      campayStatus: paymentStatus
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    next(new BadRequestError('Failed to check payment status: ' + error.message));
  }
};
