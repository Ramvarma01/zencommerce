const Orders = require("../models/Orders");
const Users = require("../models/Users");
const Products = require("../models/Products");
const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const crypto = require("crypto");

// Place a new order
const createOrder = async (req, res) => {
  try {
    const { user, items, shippingAddress, paymentMethod, totalAmount } =
      req.body;
    if (!user || !items || !shippingAddress || !paymentMethod || !totalAmount) {
      return res
        .status(400)
        .send({ success: false, message: "Missing required fields" });
    }
    // Optionally: Validate stock here
    const order = await Orders.create({
      user,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    // Remove ordered items from user's cart
    const userDetails = await Users.findById(user);
    if (userDetails && Array.isArray(userDetails.cart)) {
      // Create a set of keys for ordered items (productId + variantId if present)
      const orderedKeys = new Set(
        items.map(
          (item) =>
            item.productId + (item.variantId ? `-${item.variantId}` : "")
        )
      );
      // Filter cart to keep only items NOT ordered
      userDetails.cart = userDetails.cart.filter((cartItem) => {
        const key =
          cartItem.productId +
          (cartItem.variantId ? `-${cartItem.variantId}` : "");
        return !orderedKeys.has(key);
      });
      await userDetails.save();
    }

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      // order,
      userDetails,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;
    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: "order_rcptid_" + Date.now(),
    };
    const order = await instance.orders.create(options);
    res.send({ success: true, order });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Error creating Razorpay order",
        error: error.message,
      });
  }
};

// Verify Razorpay payment and create order in DB
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderPayload,
    } = req.body;
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderPayload
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment or order details" });
    }
    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");
    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }
    // Create order in DB
    const { user, items, shippingAddress, paymentMethod, totalAmount } =
      orderPayload;
    const order = await Orders.create({
      user,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Paid",
      totalAmount,
    });
    // Remove ordered items from user's cart (reuse logic)
    const userDetails = await Users.findById(user);
    if (userDetails && Array.isArray(userDetails.cart)) {
      const orderedKeys = new Set(
        items.map(
          (item) =>
            item.productId + (item.variantId ? `-${item.variantId}` : "")
        )
      );
      userDetails.cart = userDetails.cart.filter((cartItem) => {
        const key =
          cartItem.productId +
          (cartItem.variantId ? `-${cartItem.variantId}` : "");
        return !orderedKeys.has(key);
      });
      await userDetails.save();
    }
    res
      .status(201)
      .json({
        success: true,
        message: "Order placed and payment verified",
        order,
        userDetails,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error verifying payment or placing order",
        error: error.message,
      });
  }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Orders.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

// Get a single order by ID
// const getOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const order = await Orders.findById(id);
//     if (!order)
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });
//     res.status(200).json({ success: true, order });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching order",
//       error: error.message,
//     });
//   }
// };

// Admin: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching all orders",
      error: error.message,
    });
  }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Fetch the order first
    const order = await Orders.findById(id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    order.Orderstatus = status;
    // If delivered and paymentMethod is COD, set paymentStatus to Paid
    if (status === "Delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "Paid";
      order.deliveredAt = new Date();
    }
    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

// User: Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.findById(id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    if (order.Orderstatus === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Order already cancelled" });
    }
    order.Orderstatus = "Cancelled";
    await order.save();
    res.status(200).json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getUserOrders,
  // getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
