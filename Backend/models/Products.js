const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return this.hasVariant;
      },
    },
    price: {
      type: Number,
      required: function () {
        return this.hasVariant;
      },
    },
    originalPrice: {
      type: Number,
      required: false,
    },
    quantity: {
      type: Number,
      required: function () {
        return this.hasVariant;
      },
    },
    image: {
      type: String,
      required: function () {
        return this.hasVariant;
      },
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: function () {
        return !this.hasVariant;
      },
    },
    originalPrice: {
      type: Number,
      required: false,
    },
    quantity: {
      type: Number,
      required: function () {
        return !this.hasVariant;
      },
    },
    thumbnail: {
      type: String,
      required: true,
    },
    // thumbnailOriginalName: {
    //     type: String,
    //     required: true,
    // },
    images: {
      type: [String],
      required: true,
    },
    // imagesOriginalNames: {
    //     type: [String],
    //     required: true,
    // },
    hasVariant: {
      type: Boolean,
      default: false,
    },
    variantName: {
      type: String,
      required: function () {
        return this.hasVariant;
      },
    },
    variants: {
      type: [variantSchema],
      required: function () {
        return this.hasVariant;
      },
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4,
    },
    reviews: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Products", productSchema);

module.exports = Product;
