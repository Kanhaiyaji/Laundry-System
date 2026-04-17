/**
 * API Test Examples - Proper JavaScript Format
 * Use with Postman, Insomnia, or similar tools
 */

const API_TESTS = {
  createOrder1: {
    endpoint: 'POST http://localhost:3000/api/orders',
    headers: { 'Content-Type': 'application/json' },
    request: {
      customerName: 'Alice Johnson',
      phoneNumber: '555-123-4567',
      garments: [
        { type: 'Shirt', quantity: 5, price: 5.00 },
        { type: 'Trousers', quantity: 3, price: 7.50 },
        { type: 'Underwear', quantity: 10, price: 2.00 }
      ]
    }
  },

  createOrder2: {
    endpoint: 'POST http://localhost:3000/api/orders',
    headers: { 'Content-Type': 'application/json' },
    request: {
      customerName: 'Bob Smith',
      phoneNumber: '(555) 987-6543',
      garments: [
        { type: 'Jacket', quantity: 2, price: 15.00 },
        { type: 'Sweater', quantity: 4, price: 8.00 }
      ]
    }
  },

  createOrder3: {
    endpoint: 'POST http://localhost:3000/api/orders',
    headers: { 'Content-Type': 'application/json' },
    request: {
      customerName: 'Carol White',
      phoneNumber: '555-456-7890',
      garments: [
        { type: 'Dress', quantity: 1, price: 25.00 },
        { type: 'Blouse', quantity: 2, price: 12.00 }
      ]
    }
  },

  getAllOrders: {
    endpoint: 'GET http://localhost:3000/api/orders',
    method: 'GET'
  },

  getOrdersByStatus: {
    endpoint: 'GET http://localhost:3000/api/orders?status=RECEIVED',
    method: 'GET'
  },

  getOrdersByCustomerName: {
    endpoint: 'GET http://localhost:3000/api/orders?customerName=Alice',
    method: 'GET'
  },

  getOrdersByPhone: {
    endpoint: 'GET http://localhost:3000/api/orders?phoneNumber=555-123-4567',
    method: 'GET'
  },

  getOrderById: {
    endpoint: 'GET http://localhost:3000/api/orders/ORD-1001',
    method: 'GET'
  },

  updateOrderStatusProcessing: {
    endpoint: 'PUT http://localhost:3000/api/orders/ORD-1001',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    request: { status: 'PROCESSING' }
  },

  updateOrderStatusReady: {
    endpoint: 'PUT http://localhost:3000/api/orders/ORD-1001',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    request: { status: 'READY' }
  },

  updateOrderStatusDelivered: {
    endpoint: 'PUT http://localhost:3000/api/orders/ORD-1001',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    request: { status: 'DELIVERED' }
  },

  getAdminDashboard: {
    endpoint: 'GET http://localhost:3000/admin/dashboard',
    method: 'GET'
  },

  errorInvalidPhone: {
    endpoint: 'POST http://localhost:3000/api/orders',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    request: {
      customerName: 'John Doe',
      phoneNumber: 'invalid-phone',
      garments: [
        { type: 'Shirt', quantity: 1, price: 5.00 }
      ]
    },
    expectedStatus: 400
  },

  errorInvalidGarments: {
    endpoint: 'POST http://localhost:3000/api/orders',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    request: {
      customerName: 'Jane Smith',
      phoneNumber: '555-123-4567',
      garments: [
        { type: 'Shirt', quantity: -5, price: 5.00 },
        { type: 'Pants', quantity: 2, price: -10 }
      ]
    },
    expectedStatus: 400
  },

  errorOrderNotFound: {
    endpoint: 'GET http://localhost:3000/api/orders/ORD-9999',
    method: 'GET',
    expectedStatus: 404
  },

  errorInvalidStatus: {
    endpoint: 'PUT http://localhost:3000/api/orders/ORD-1001',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    request: { status: 'CANCELLED' },
    expectedStatus: 400
  }
};

module.exports = API_TESTS;
