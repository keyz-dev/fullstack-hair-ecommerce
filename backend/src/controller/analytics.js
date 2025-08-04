const Order = require('../models/order');
const Booking = require('../models/booking');
const User = require('../models/user');
const { AppError } = require('../utils/errors');

// Helper function to calculate date range
const getDateRange = (range) => {
  const now = new Date();
  let startDate = new Date();

  switch (range) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      break;
    case '6m':
      startDate.setMonth(now.getMonth() - 6);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      // Custom range format: "2024-01-01_2024-01-31"
      if (range.includes('_')) {
        const [start, end] = range.split('_');
        return {
          startDate: new Date(start),
          endDate: new Date(end)
        };
      }
      startDate.setDate(now.getDate() - 30);
  }

  return { startDate, endDate: now };
};

// Get client overview analytics
exports.getClientAnalytics = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query;
    const userId = req.authUser._id;
    const { startDate, endDate } = getDateRange(range);

    // Get user's orders and bookings
    const [orders, bookings, user] = await Promise.all([
      Order.find({
        user: userId,
        createdAt: { $gte: startDate, $lte: endDate }
      }),
      Booking.find({
        user: userId,
        createdAt: { $gte: startDate, $lte: endDate }
      }),
      User.findById(userId).populate('wishlist')
    ]);

    // Calculate overview stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const activeBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length;
    const wishlistCount = user.wishlist?.length || 0;

    // Calculate trends (simplified - you can enhance this)
    const previousRange = {
      startDate: new Date(startDate.getTime() - (endDate - startDate)),
      endDate: startDate
    };

    const [prevOrders, prevBookings] = await Promise.all([
      Order.find({
        user: userId,
        createdAt: { $gte: previousRange.startDate, $lte: previousRange.endDate }
      }),
      Booking.find({
        user: userId,
        createdAt: { $gte: previousRange.startDate, $lte: previousRange.endDate }
      })
    ]);

    const prevTotalOrders = prevOrders.length;
    const prevTotalSpent = prevOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const orderTrend = prevTotalOrders > 0 
      ? { direction: totalOrders > prevTotalOrders ? 'up' : 'down', percentage: Math.abs(((totalOrders - prevTotalOrders) / prevTotalOrders) * 100).toFixed(1) }
      : null;

    const spendingTrend = prevTotalSpent > 0
      ? { direction: totalSpent > prevTotalSpent ? 'up' : 'down', percentage: Math.abs(((totalSpent - prevTotalSpent) / prevTotalSpent) * 100).toFixed(1) }
      : null;

    res.json({
      success: true,
      data: {
        totalOrders,
        totalSpent,
        activeBookings,
        wishlistCount,
        reviewsCount: 0, // You can add review model later
        memberSince: user.createdAt,
        orderTrend,
        spendingTrend,
        bookingTrend: null // Add booking trend calculation if needed
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get order analytics
exports.getOrderAnalytics = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query;
    const userId = req.authUser._id;
    const { startDate, endDate } = getDateRange(range);

    const orders = await Order.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    // Status distribution
    const statusCounts = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));

    res.json({
      success: true,
      data: {
        totalOrders: orders.length,
        statusDistribution,
        recentOrders: orders.slice(0, 5).map(order => ({
          id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get booking analytics
exports.getBookingAnalytics = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query;
    const userId = req.authUser._id;
    const { startDate, endDate } = getDateRange(range);

    const bookings = await Booking.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('service staff');

    // Status distribution
    const statusCounts = {};
    bookings.forEach(booking => {
      statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1;
    });

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));

    res.json({
      success: true,
      data: {
        totalBookings: bookings.length,
        statusDistribution,
        recentBookings: bookings.slice(0, 5).map(booking => ({
          id: booking._id,
          service: booking.service?.name,
          staff: booking.staff?.name,
          date: booking.date,
          status: booking.status,
          createdAt: booking.createdAt
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get spending analytics
exports.getSpendingAnalytics = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query;
    const userId = req.authUser._id;
    const { startDate, endDate } = getDateRange(range);

    const orders = await Order.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    // Group by date for chart data
    const spendingByDate = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      spendingByDate[date] = (spendingByDate[date] || 0) + order.totalAmount;
    });

    const chartData = Object.entries(spendingByDate).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount
    }));

    res.json({
      success: true,
      data: {
        totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
        chartData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get activity timeline
exports.getActivityTimeline = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const userId = req.authUser._id;

    const [orders, bookings] = await Promise.all([
      Order.find({ user: userId }).sort({ createdAt: -1 }).limit(limit),
      Booking.find({ user: userId }).sort({ createdAt: -1 }).limit(limit)
    ]);

    // Combine and sort activities
    const activities = [
      ...orders.map(order => ({
        type: 'order',
        title: `Order #${order.orderNumber}`,
        description: `Order placed for $${order.totalAmount}`,
        timestamp: order.createdAt
      })),
      ...bookings.map(booking => ({
        type: 'booking',
        title: `Booking scheduled`,
        description: `Appointment booked for ${new Date(booking.date).toLocaleDateString()}`,
        timestamp: booking.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    next(error);
  }
}; 