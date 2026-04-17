const mongoose = require('mongoose');

const GARMENT_SCHEMA = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const ORDER_SCHEMA = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    garments: { type: [GARMENT_SCHEMA], required: true },
    totalBill: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
      default: 'RECEIVED'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const OrderEntity = mongoose.models.Order || mongoose.model('Order', ORDER_SCHEMA);

const calculateTotalBill = (garments) => {
  return garments.reduce((total, garment) => total + (garment.quantity * garment.price), 0);
};

const generateOrderId = async () => {
  const latestOrder = await OrderEntity.findOne({}, { orderId: 1 }).sort({ createdAt: -1 }).lean();

  if (!latestOrder || !latestOrder.orderId) {
    return 'ORD-1001';
  }

  const match = latestOrder.orderId.match(/^ORD-(\d+)$/);
  const latestNumber = match ? Number(match[1]) : 1000;
  return `ORD-${latestNumber + 1}`;
};

const createOrder = async (customerName, phoneNumber, address, garments) => {
  const orderId = await generateOrderId();
  const totalBill = calculateTotalBill(garments);

  const order = await OrderEntity.create({
    orderId,
    customerName,
    phoneNumber,
    address,
    garments,
    totalBill,
    status: 'RECEIVED'
  });

  return order.toObject();
};

const getAllOrders = async () => {
  return OrderEntity.find({}).sort({ createdAt: -1 }).lean();
};

const getOrderById = async (orderId) => {
  return OrderEntity.findOne({ orderId }).lean();
};

const updateOrderStatus = async (orderId, newStatus) => {
  return OrderEntity.findOneAndUpdate(
    { orderId },
    { $set: { status: newStatus } },
    { new: true, lean: true }
  );
};

const filterOrders = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.customerName) {
    query.customerName = { $regex: filters.customerName, $options: 'i' };
  }

  if (filters.phoneNumber) {
    query.phoneNumber = { $regex: filters.phoneNumber, $options: 'i' };
  }

  return OrderEntity.find(query).sort({ createdAt: -1 }).lean();
};

const getDashboardStats = async () => {
  const orders = await getAllOrders();

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalBill, 0),
    ordersByStatus: {
      RECEIVED: 0,
      PROCESSING: 0,
      READY: 0,
      DELIVERED: 0
    },
    orders
  };

  orders.forEach((order) => {
    if (stats.ordersByStatus[order.status] !== undefined) {
      stats.ordersByStatus[order.status] += 1;
    }
  });

  return stats;
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  filterOrders,
  getDashboardStats,
  generateOrderId,
  calculateTotalBill
};
