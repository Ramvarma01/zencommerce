const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }, // snapshot of price at time of order
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  }, // Only if product has variant
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },

    paymentMethod: {
      type: String, // e.g., 'COD', 'Online'
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    Orderstatus: {
      type: String,
      enum: ["Ordered", "Shipped", "Delivered", "Cancelled"],
      required: true,
      default: "Ordered",
    },
    deliveredAt: {
      type: Date,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
