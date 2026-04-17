/**
 * Order Model - In-Memory Storage
 */

let orders = [];
let orderIdCounter = 1000;

/**
 * Generate unique order ID
 */
const generateOrderId = () => {
  return `ORD-${++orderIdCounter}`;
};

/**
 * Calculate total bill from garments
 */
const calculateTotalBill = (garments) => {
  return garments.reduce((total, garment) => {
    return total + (garment.quantity * garment.price);
  }, 0);
};

/**
 * Create a new order
 */
const createOrder = (customerName, phoneNumber, address, garments) => {
  const orderId = generateOrderId();
  const totalBill = calculateTotalBill(garments);
  const createdAt = new Date().toISOString();

  const order = {
    orderId,
    customerName,
    phoneNumber,
    address,
    garments,
    totalBill,
    status: 'RECEIVED',
    createdAt,
    updatedAt: createdAt
  };

  orders.push(order);
  return order;
};

/**
 * Get all orders
 */
const getAllOrders = () => {
  return orders;
};

/**
 * Get order by ID
 */
const getOrderById = (orderId) => {
  return orders.find(order => order.orderId === orderId);
};

/**
 * Update order status
 */
const updateOrderStatus = (orderId, newStatus) => {
  const order = getOrderById(orderId);
  if (order) {
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();
    return order;
  }
  return null;
};

/**
 * Filter orders by criteria
 */
const filterOrders = (filters = {}) => {
  let filtered = [...orders];

  if (filters.status) {
    filtered = filtered.filter(order => order.status === filters.status);
  }

  if (filters.customerName) {
    filtered = filtered.filter(order =>
      order.customerName.toLowerCase().includes(filters.customerName.toLowerCase())
    );
  }

  if (filters.phoneNumber) {
    filtered = filtered.filter(order =>
      order.phoneNumber.includes(filters.phoneNumber)
    );
  }

  return filtered;
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = () => {
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalBill, 0),
    ordersByStatus: {
      RECEIVED: 0,
      PROCESSING: 0,
      READY: 0,
      DELIVERED: 0
    },
    orders: orders
  };

  // Count orders by status
  orders.forEach(order => {
    stats.ordersByStatus[order.status]++;
  });

  return stats;
};

/**
 * Get order count by status
 */
const getOrderCountByStatus = (status) => {
  return orders.filter(order => order.status === status).length;
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  filterOrders,
  getDashboardStats,
  getOrderCountByStatus,
  generateOrderId,
  calculateTotalBill
};
