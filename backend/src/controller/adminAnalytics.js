const Order = require('../models/order');
const Booking = require('../models/booking');
const User = require('../models/user');
const Product = require('../models/product');
const { AppError } = require('../utils/errors');

// Helper function to calculate date range (reusing from client analytics)
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

// Get admin overview analytics
exports.getAdminOverview = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query;
    const { startDate, endDate } = getDateRange(range);

    // Get all data for overview
    const [orders, bookings, users, products] = await Promise.all([
      Order.find({ createdAt: { $gte: startDate, $lte: endDate } }),
      Booking.find({ createdAt: { $gte: startDate, $lte: endDate } }),
      User.find({ createdAt: { $gte: startDate, $lte: endDate } }),
      Product.find()
    ]);

    // Calculate overview stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const totalProducts = products.length;
    const activeBookings = bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length;

    // Calculate conversion rate (simplified)
    const totalVisitors = users.length * 10; // Mock data - replace with actual analytics
    const conversionRate = totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(1) : 0;

    // Calculate trends
    const previousRange = {
      startDate: new Date(startDate.getTime() - (endDate - startDate)),
      endDate: startDate
    };

    const [prevOrders, prevUsers, prevBookings] = await Promise.all([
      Order.find({ createdAt: { $gte: previousRange.startDate, $lte: previousRange.endDate } }),
      User.find({ createdAt: { $gte: previousRange.startDate, $lte: previousRange.endDate } }),
      Booking.find({ createdAt: { $gte: previousRange.startDate, $lte: previousRange.endDate } })
    ]);

    const prevRevenue = prevOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const prevOrdersCount = prevOrders.length;
    const prevUsersCount = prevUsers.length;

    const revenueTrend = prevRevenue > 0 
      ? { direction: totalRevenue > prevRevenue ? 'up' : 'down', percentage: Math.abs(((totalRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1) }
      : null;

    const orderTrend = prevOrdersCount > 0
      ? { direction: totalOrders > prevOrdersCount ? 'up' : 'down', percentage: Math.abs(((totalOrders - prevOrdersCount) / prevOrdersCount) * 100).toFixed(1) }
      : null;

    const userTrend = prevUsersCount > 0
      ? { direction: activeUsers > prevUsersCount ? 'up' : 'down', percentage: Math.abs(((activeUsers - prevUsersCount) / prevUsersCount) * 100).toFixed(1) }
      : null;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        activeUsers,
        totalProducts,
        activeBookings,
        conversionRate,
        revenueTrend,
        orderTrend,
        userTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get sales analytics
exports.getSalesAnalytics = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query;
    const { startDate, endDate } = getDateRange(range);

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    // Group by date for chart data
    const salesByDate = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      salesByDate[date] = (salesByDate[date] || 0) + order.totalAmount;
    });

    const chartData = Object.entries(salesByDate).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: amount
    }));

    res.json({
      success: true,
      data: {
        totalSales: orders.reduce((sum, order) => sum + order.totalAmount, 0),
        averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
        chartData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user analytics
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query;
    const { startDate, endDate } = getDateRange(range);

    const users = await User.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    // Group by date for growth chart
    const usersByDate = {};
    users.forEach(user => {
      const date = user.createdAt.toISOString().split('T')[0];
      usersByDate[date] = (usersByDate[date] || 0) + 1;
    });

    const growthData = Object.entries(usersByDate).map(([date, count]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: count
    }));

    res.json({
      success: true,
      data: {
        totalUsers: users.length,
        activeUsers: users.filter(user => user.isActive).length,
        growthData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get product analytics
exports.getProductAnalytics = async (req, res, next) => {
  try {
    const products = await Product.find();

    // Status distribution
    const statusCounts = {};
    products.forEach(product => {
      const status = product.stock > 0 ? 'In Stock' : 'Out of Stock';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));

    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        statusDistribution,
        lowStockProducts: products.filter(p => p.stock > 0 && p.stock <= 10).length
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
    const { startDate, endDate } = getDateRange(range);

    const orders = await Order.find({
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
    const { startDate, endDate } = getDateRange(range);

    const bookings = await Booking.find({
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

// Get revenue analytics
exports.getRevenueAnalytics = async (req, res, next) => {
  try {
    const { range = '30d' } = req.query;
    const { startDate, endDate } = getDateRange(range);

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    // Group by date for chart data
    const revenueByDate = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      revenueByDate[date] = (revenueByDate[date] || 0) + order.totalAmount;
    });

    const chartData = Object.entries(revenueByDate).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: amount
    }));

    res.json({
      success: true,
      data: {
        totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
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

    const [orders, bookings, users, products] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).limit(limit),
      Booking.find().sort({ createdAt: -1 }).limit(limit),
      User.find().sort({ createdAt: -1 }).limit(limit),
      Product.find().sort({ createdAt: -1 }).limit(limit)
    ]);

    // Combine and sort activities
    const activities = [
      ...orders.map(order => ({
        type: 'order',
        title: `New Order #${order.orderNumber}`,
        description: `Order placed for $${order.totalAmount}`,
        timestamp: order.createdAt
      })),
      ...bookings.map(booking => ({
        type: 'booking',
        title: `New Booking`,
        description: `Appointment booked for ${new Date(booking.date).toLocaleDateString()}`,
        timestamp: booking.createdAt
      })),
      ...users.map(user => ({
        type: 'user',
        title: `New User Registration`,
        description: `${user.name} joined the platform`,
        timestamp: user.createdAt
      })),
      ...products.map(product => ({
        type: 'product',
        title: `New Product Added`,
        description: `${product.name} added to inventory`,
        timestamp: product.createdAt
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