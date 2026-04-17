/**
 * Mini Laundry Order Management System - API Server
 * Node.js + Express
 */

const express = require('express');
require('dotenv').config();
const orderRoutes = require('./routes/orders');
const orderController = require('./controllers/orderController');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;

  if (CLIENT_ORIGINS.length === 0) {
    res.header('Access-Control-Allow-Origin', '*');
  } else if (requestOrigin && CLIENT_ORIGINS.includes(requestOrigin)) {
    res.header('Access-Control-Allow-Origin', requestOrigin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Laundry Order Management System is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/orders', orderRoutes);

// Admin Dashboard
app.get('/admin/dashboard', orderController.getAdminDashboard);

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Laundry Order Management System API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      orders: {
        createOrder: 'POST /api/orders',
        getAllOrders: 'GET /api/orders',
        getOrderById: 'GET /api/orders/:orderId',
        updateOrderStatus: 'PUT /api/orders/:orderId'
      },
      admin: {
        dashboard: 'GET /admin/dashboard'
      }
    },
    exampleRequest: {
      method: 'POST',
      url: '/api/orders',
      body: {
        customerName: 'John Doe',
        phoneNumber: '555-123-4567',
        address: '221B Baker Street, London',
        garments: [
          { type: 'Shirt', quantity: 3, price: 5.00 },
          { type: 'Trousers', quantity: 2, price: 7.50 }
        ]
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n========================================`);
      console.log(`Laundry Order Management System API`);
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`========================================\n`);
      console.log('Available endpoints:');
      console.log(`  Health Check: GET http://localhost:${PORT}/health`);
      console.log(`  API Docs: GET http://localhost:${PORT}/`);
      console.log(`  Dashboard: GET http://localhost:${PORT}/admin/dashboard`);
      console.log(`  Orders: GET http://localhost:${PORT}/api/orders`);
      console.log(`========================================\n`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
