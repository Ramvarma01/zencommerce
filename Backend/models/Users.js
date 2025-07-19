const mongoose = require('mongoose')

// Define address sub-schema
const addressSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true
    },
    address: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: true 
    },
    pincode: { 
        type: String, 
        required: true 
    },
    country: { 
        type: String, 
        required: true 
    },
}, { _id: true });


const cartSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false, // Only if product has variant
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1,
    },
    // priceAtAddTime: {
    //   type: Number,
    //   required: true, // Store price snapshot to avoid future price conflict
    // },
});


const usersSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: [true, 'Please add name'],
            trim: true
        },
        email : {
            type: String,
            required: [true, 'Please add email'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password :{
            type: String,
            required: function() {
                return !this.isGoogleUser; // Password only required for non-Google users
            },
            min: 6,
            max: 64
        },
        phone: { 
            type: String,
            unique: true,
            trim: true,
            sparse: true // Allows multiple null values
        },
        // Google-specific fields
        googleId: {
            type: String,
            unique: true,
            sparse: true // Allows multiple null values
        },
        isGoogleUser: {
            type: Boolean,
            default: false
        },
        shippingAddress: {
            type: [addressSchema],
            default: []
        },
        wishlist:{ 
            type: [mongoose.Schema.Types.ObjectId], 
            ref: 'Products', 
            default: []
        },
        cart: {
            type: [cartSchema],
            default: []
        }
    },{timestamps: true}
);

module.exports = mongoose.model('users', usersSchema);