const Order = require('../models/order');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const campayService = require('../utils/campay');

// Initiate payment for an order
exports.initiatePayment = async (req, res, next) => {
  const { orderId, phoneNumber } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return next(new NotFoundError('Order not found'));
  try {
    const paymentData = {
      amount: order.totalAmount,
      phoneNumber,
      description: `Payment for order ${orderId}`,
      orderId,
    };
    const paymentResponse = await campayService.initiatePayment(paymentData);
    order.paymentMethod = 'momo';
    order.paymentStatus = 'pending';
    await order.save();
    res.status(200).json({
      success: true,
      message: 'Payment initiated successfully',
      paymentReference: paymentResponse.reference,
      order,
    });
  } catch (error) {
    next(new BadRequestError('Payment initiation failed: ' + error.message));
  }
};

// Campay webhook
exports.handleWebhook = async (req, res, next) => {
  const { reference, status, external_reference } = req.body;
  try {
    const order = await Order.findById(external_reference);
    if (!order) return next(new NotFoundError('Order not found'));
    if (status === 'SUCCESSFUL') {
      order.paymentStatus = 'paid';
      order.paymentTime = new Date();
      order.status = 'accepted';
    } else if (status === 'FAILED') {
      order.paymentStatus = 'failed';
    }
    await order.save();
    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    next(new BadRequestError('Webhook processing failed: ' + error.message));
  }
};
