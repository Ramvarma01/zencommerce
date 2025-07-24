const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controllers/OrderController');

// Place a new order
router.post('/create-order', createOrder);
// Get all orders for a user
router.get('/user-orders/:userId', getUserOrders);
// Get a single order by ID
router.get('/order/:id', getOrderById);
// Admin: Get all orders
router.get('/all-orders', getAllOrders);
// Admin: Update order status
router.put('/order-status/:id', updateOrderStatus);
// User: Cancel order
router.put('/cancel-order/:id', cancelOrder);
// Create Razorpay order
router.post('/create-razorpay-order', createRazorpayOrder);
// Verify Razorpay payment
router.post('/verify-razorpay-payment', verifyRazorpayPayment);

module.exports = router; 