const Orders = require('../models/Orders');
const Users = require('../models/Users');
const Products = require('../models/Products');

// Place a new order
const createOrder = async (req, res) => {
  try {
    const { user, items, shippingAddress, paymentMethod, totalAmount } = req.body;
    if (!user || !items || !shippingAddress || !paymentMethod || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    // Optionally: Validate stock here
    const order = await Orders.create({
      user,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });
    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error placing order', error: error.message });
  }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Orders.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user orders', error: error.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching order', error: error.message });
  }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching all orders', error: error.message });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Orders.findByIdAndUpdate(
      id,
      { Orderstatus: status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating order status', error: error.message });
  }
};

// User: Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.Orderstatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Order already cancelled' });
    }
    order.Orderstatus = 'Cancelled';
    await order.save();
    res.status(200).json({ success: true, message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error cancelling order', error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
}; 