/**
 * Order Controller - Business Logic
 */

const Order = require('../models/order');
const { validateCreateOrderRequest, validateOrderStatus } = require('../utils/validation');

/**
 * Create a new order
 */
const createOrder = (req, res) => {
  try {
    const { customerName, phoneNumber, address, garments } = req.body;

    const validation = validateCreateOrderRequest({ customerName, phoneNumber, address, garments });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    const order = Order.createOrder(customerName, phoneNumber, address, garments);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all orders with optional filters
 */
const getOrders = (req, res) => {
  try {
    const { status, customerName, phoneNumber } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (customerName) filters.customerName = customerName;
    if (phoneNumber) filters.phoneNumber = phoneNumber;

    const orders = Object.keys(filters).length > 0
      ? Order.filterOrders(filters)
      : Order.getAllOrders();

    return res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      count: orders.length,
      data: orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get order by ID
 */
const getOrderById = (req, res) => {
  try {
    const { orderId } = req.params;
    const order = Order.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order ${orderId} not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update order status
 */
const updateOrderStatus = (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || typeof status !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Status is required and must be a string'
      });
    }

    if (!validateOrderStatus(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: RECEIVED, PROCESSING, READY, DELIVERED'
      });
    }

    const order = Order.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order ${orderId} not found`
      });
    }

    const updatedOrder = Order.updateOrderStatus(orderId, status);

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get admin dashboard stats
 */
const getAdminDashboard = (req, res) => {
  try {
    const stats = Order.getDashboardStats();

    return res.status(200).json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue.toFixed(2),
        ordersByStatus: stats.ordersByStatus,
        orders: stats.orders
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAdminDashboard
};
