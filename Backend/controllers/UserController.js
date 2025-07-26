const JWT = require("jsonwebtoken");
const Users = require("../models/Users");
const Products = require("../models/Products");
const bcrypt = require("bcrypt");
// const { OAuth2Client } = require('google-auth-library');
// var { expressjwt: jwt } = require("express-jwt");

// Initialize Google OAuth client
// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '936846667108-d7e0tieab80e1tv3cpmg1jr1o2tqqrt3.apps.googleusercontent.com');

//middleware
// const requireSingIn = jwt({
//     secret: process.env.JWT_SECURE,
//     algorithms: ["HS256"],
//   });

//REGISTER CONTROLLER
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    //validation
    // if (!name || !email || !password || !phone) {
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }
    if (password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "password should be 6 character long",
      });
    }

    // existing user with email
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User ALready Register With this Email-ID",
      });
    }

    //hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    //save user
    const user = await Users({
      name,
      email,
      password: hashedPassword,
      // phone,
    }).save();

    return res.status(200).send({
      success: true,
      message: "Registeration Successfull Please login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in register API",
      error: error,
    });
  }
};

//LOGIN CONTROLLER
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    //find user
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not found",
      });
    }

    //match password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send({
        success: false,
        message: "incorrect password",
      });
    }

    //TOKEN JWT
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECURE, {
      expiresIn: "7d",
    });

    //undefine Password
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in login API",
      error,
    });
  }
};

//GOOGLE LOGIN CONTROLLER
const googleLoginController = async (req, res) => {
  try {
    const { name, email, googleId, password } = req.body;
    let user = await Users.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await Users({
        name: name,
        email: email,
        // profilePicture: picture,
        googleId: googleId,
        isGoogleUser: "true",
        password: password,
      }).save();
      console.log("New Google user created:", user);
    } else {
      console.log("Existing user found:", user);
    }

    // Generate JWT token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECURE, {
      expiresIn: "7d",
    });

    // Remove password from response
    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Google login success",
      token,
      user,
    });
  } catch (error) {
    console.log("Google login error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in Google login API",
      error: error.message,
    });
  }
};

//UPDATE USER CONTROLLER
const updateUserController = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Find the user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Hash password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    // Update user fields
    const updatedUser = await Users.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        phone: phone || user.phone,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile Updated",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error In User Update API",
      error,
    });
  }
};

//UPDATE PASSWORD CONTROLLER
const updatePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword, email } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Incorrect current password",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await Users.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Password updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error In User Update API",
      error,
    });
  }
};

//ADD SHIPPING ADDRESS CONTROLLER
const addShippingAddressController = async (req, res) => {
  try {
    const { email, shippingAddress } = req.body;
    
    // Validate required fields
    if (!email || !shippingAddress) {
      return res.status(400).send({
        success: false,
        message: "Email and shipping address are required",
      });
    }

    const { fullName, phone, address, city, state, pincode, country } = shippingAddress;
    if (!fullName || !phone || !address || !city || !state || !pincode || !country) {
      return res.status(400).send({
        success: false,
        message: "All address fields are required",
      });
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).send({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if address already exists
    const addressExists = user.shippingAddress.some(addr => 
      addr.fullName === fullName &&
      addr.phone === phone &&
      addr.address === address &&
      addr.city === city &&
      addr.state === state &&
      addr.pincode === pincode &&
      addr.country === country
    );

    if (addressExists) {
      return res.status(400).send({
        success: false,
        message: "This address already exists",
      });
    }

    user.shippingAddress.push(shippingAddress);
    await user.save();
    res.status(200).send({
      success: true,
      message: "Shipping Address Added Successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error In User Update API",
      error,
    });
  }
};

//DELETE SHIPPING ADDRESS CONTROLLER
const deleteShippingAddressController = async (req, res) => {
  try {
    const { email, shippingAddress } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Remove the address that matches all fields
    user.shippingAddress = user.shippingAddress.filter((addr) => {
      return !(
        addr.fullName === shippingAddress.fullName &&
        addr.phone === shippingAddress.phone &&
        addr.address === shippingAddress.address &&
        addr.city === shippingAddress.city &&
        addr.state === shippingAddress.state &&
        addr.pincode === shippingAddress.pincode &&
        addr.country === shippingAddress.country
      );
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Shipping Address Deleted Successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error In User Delete API",
      error,
    });
  }
};

//UPDATE SHIPPING ADDRESS CONTROLLER
const updateShippingAddressController = async (req, res) => {
  try {
    const { email, oldAddress, newAddress } = req.body;
    
    // Validate required fields
    if (!email || !oldAddress || !newAddress) {
      return res.status(400).send({
        success: false,
        message: "Email, old address, and new address are required",
      });
    }

    const { fullName, phone, address, city, state, pincode, country } = newAddress;
    if (!fullName || !phone || !address || !city || !state || !pincode || !country) {
      return res.status(400).send({
        success: false,
        message: "All address fields are required",
      });
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).send({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Find and update the address that matches oldAddress
    const addressIndex = user.shippingAddress.findIndex((addr) => {
      return (
        addr.fullName === oldAddress.fullName &&
        addr.phone === oldAddress.phone &&
        addr.address === oldAddress.address &&
        addr.city === oldAddress.city &&
        addr.state === oldAddress.state &&
        addr.pincode === oldAddress.pincode &&
        addr.country === oldAddress.country
      );
    });

    if (addressIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Address not found",
      });
    }

    // Update the address
    user.shippingAddress[addressIndex] = newAddress;
    await user.save();
    
    res.status(200).send({
      success: true,
      message: "Shipping Address Updated Successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error In User Update API",
      error,
    });
  }
};

//SET DEFAULT ADDRESS CONTROLLER
const setDefaultAddressController = async (req, res) => {
  try {
    const { email, addressIndex } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (addressIndex < 0 || addressIndex >= user.shippingAddress.length) {
      return res.status(400).send({
        success: false,
        message: "Invalid address index",
      });
    }

    // Set default address index
    user.defaultAddressIndex = addressIndex;
    await user.save();
    
    res.status(200).send({
      success: true,
      message: "Default Address Set Successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error In Setting Default Address",
      error,
    });
  }
};

//ADD PRODUCT TO WISHLIST
const addProductToWishlistController = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id } = req.body;

    // Validate user exists
    const user = await Users.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if product already in wishlist
    if (user.wishlist.includes(product_id)) {
      return res.status(400).send({
        success: false,
        message: "Product already in wishlist",
      });
    }

    // Validate product exists (optional but recommended)
    const product = await Products.findById(product_id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Add to wishlist
    user.wishlist.push(product_id);
    await user.save();

    res.status(200).send({
      success: true,
      message: "Product added to wishlist successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error adding product to wishlist",
      error: error.message,
    });
  }
};

//REMOVE PRODUCTS FROM WISHLIST CONTROLLER
const removeProductFromWishlistController = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id } = req.body; // Single product ID

    // Added validation
    if (!product_id) {
      return res.status(400).send({
        success: false,
        message: "Product ID is required",
      });
    }

    // Validate user exists
    const user = await Users.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if product exists in wishlist
    if (!user.wishlist.includes(product_id)) {
      return res.status(400).send({
        success: false,
        message: "Product not found in wishlist",
      });
    }

    // Store original length before filtering
    const originalWishlistLength = user.wishlist.length;
    // Fixed filtering logic
    user.wishlist = user.wishlist.filter(
      (productId) => productId != product_id
    );
    // Calculate removed count
    const removedCount = originalWishlistLength - user.wishlist.length;

    await user.save();

    res.status(200).send({
      success: true,
      message: `${removedCount} product removed from wishlist successfully`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error removing product from wishlist",
      error: error.message,
    });
  }
};


//REMOVE ALL PRODUCTS FROM WISHLIST CONTROLLER
const clearWishlistController = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user exists
    const user = await Users.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if product exists in wishlist
    if (!user.wishlist) {
      return res.status(400).send({
        success: false,
        message: "No product in wishlist",
      });
    }

    // Store original length before filtering
    const originalWishlistLength = user.wishlist.length;
    
    user.wishlist = [];
    // Calculate removed count
    const removedCount = originalWishlistLength - user.wishlist.length;

    await user.save();

    res.status(200).send({
      success: true,
      message: `${removedCount} product removed from wishlist successfully`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error removing product from wishlist",
      error: error.message,
    });
  }
};


//ADD PRODUCT TO THE CART
const addProductToCartController = async (req, res) => {
  try {
    const { id } = req.params;
    const { cartItem } = req.body;

    // Validate user exists
    const user = await Users.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Validate cartItem structure
    if (!cartItem || !cartItem.productId) {
      return res.status(400).send({
        success: false,
        message: "Cart item with productId is required",
      });
    }

    // Check if product already in cart (new cart structure)
    // const isInCart = user.cart.some(item => item.productId.toString() === cartItem.productId);
    // if (isInCart) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Product already in cart",
    //   });
    // }

    // Validate product exists
    const product = await Products.findById(cartItem.productId);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // Validate variant if provided
    if (cartItem.variantId) {
      const variant = product.variants?.find(v => v._id.toString() === cartItem.variantId);
      if (!variant) {
        return res.status(404).send({
          success: false,
          message: "Product variant not found",
        });
      }
    }

    // Add to cart with new structure
    const newCartItem = {
      productId: cartItem.productId,
      quantity: cartItem.quantity || 1
    };

    if (cartItem.variantId) {
      newCartItem.variantId = cartItem.variantId;
    }

    user.cart.push(newCartItem);

    // Remove from wishlist if present
    if (user.wishlist.includes(cartItem.productId)){
      user.wishlist = user.wishlist.filter(
        (productId) => productId != cartItem.productId
      );
    }

    await user.save();

    res.status(200).send({
      success: true,
      message: "Product added to the cart successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error adding product to cart",
      error: error.message,
    });
  }
};

const removeProductFromCartController = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, variant_id } = req.body; // Accept variant_id optionally

    if (!product_id) {
      return res.status(400).send({
        success: false,
        message: "Product ID is required",
      });
    }

    // Validate user exists
    const user = await Users.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Find the cart item (optionally by variant)
    const selectedCartItem = user.cart.find(
      (cartItem) =>
        cartItem.productId.toString() === product_id &&
        (!variant_id || cartItem.variantId?.toString() === variant_id)
    );

    if (!selectedCartItem) {
      return res.status(400).send({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Remove the item from the cart
    const originalCartLength = user.cart.length;
    user.cart = user.cart.filter(
      (cartItem) =>
        !(
          cartItem.productId.toString() === product_id &&
          (!variant_id || cartItem.variantId?.toString() === variant_id)
        )
    );
    const removedCount = originalCartLength - user.cart.length;

    await user.save();

    res.status(200).send({
      success: true,
      message: `${removedCount} product removed from cart successfully`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error removing product from cart",
      error: error.message,
    });
  }
};


module.exports = {
  registerController,
  loginController,
  googleLoginController,
  updateUserController,
  updatePasswordController,
  addShippingAddressController,
  deleteShippingAddressController,
  updateShippingAddressController,
  setDefaultAddressController,
  addProductToWishlistController,
  removeProductFromWishlistController,
  clearWishlistController,
  addProductToCartController,
  removeProductFromCartController,
};
