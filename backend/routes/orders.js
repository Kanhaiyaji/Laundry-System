/**
 * Order Routes
 */

const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

/**
 * Create Order
 * POST /api/orders
 */
router.post('/', orderController.createOrder);

/**
 * Get All Orders with optional filters
 * GET /api/orders
 * Query params: ?status=READY&customerName=John&phoneNumber=1234567890
 */
router.get('/', orderController.getOrders);

/**
 * Get Order by ID
 * GET /api/orders/:orderId
 */
router.get('/:orderId', orderController.getOrderById);

/**
 * Update Order Status
 * PUT /api/orders/:orderId
 */
router.put('/:orderId', orderController.updateOrderStatus);

module.exports = router;
