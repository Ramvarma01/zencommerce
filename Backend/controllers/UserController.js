const JWT = require("jsonwebtoken");
const Users = require("../models/Users");
const Products = require("../models/Products");
const bcrypt = require("bcrypt");
const axios = require("axios");
const nodemailer = require("nodemailer");
// const { OAuth2Client } = require('google-auth-library');
// var { expressjwt: jwt } = require("express-jwt");

// Initialize Google OAuth client
// const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '936846667108-d7e0tieab80e1tv3cpmg1jr1o2tqqrt3.apps.googleusercontent.com');

//middleware
// const requireSingIn = jwt({
//     secret: process.env.JWT_SECURE,
//     algorithms: ["HS256"],
//   });

//SEND OTP CONTROLLER
const sendOtpController = async (req, res) => {
  try {
    const { name, email } = req.body;

    //validation
    if (!name || !email) {
      return res.status(400).send({
        success: false,
        message: "Please provide name and email",
      });
    }

    // Check if email format is valid
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).send({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check if user already exists
    const existingUser = await Users.findOne({ email: email });
    if (existingUser && existingUser.emailVerified) {
      return res.status(409).send({
        success: false,
        message: "User already registered with this email",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save or update user with OTP
    if (existingUser) {
      existingUser.name = name;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      await Users({
        name,
        email,
        otp,
        otpExpiry,
      }).save();
    }

    // Send OTP via email using a free API (using EmailJS or similar)
    // For now, we'll use a mock email service
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      // Send OTP email using Nodemailer
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Email Verification OTP",
        text: `Your OTP for email verification is: ${otp}. This OTP will expire in 10 minutes.`,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the request if email fails, just log it
    }

    return res.status(200).send({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in sending OTP",
      error: error.message,
    });
  }
};

//VERIFY OTP CONTROLLER
const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    //validation
    if (!email || !otp) {
      return res.status(400).send({
        success: false,
        message: "Please provide email and OTP",
      });
    }

    // Find user
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if OTP is expired
    if (user.otpExpiry < new Date()) {
      return res.status(400).send({
        success: false,
        message: "OTP has expired",
      });
    }

    // Mark email as verified
    user.emailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in verifying OTP",
      error: error.message,
    });
  }
};

//REGISTER CONTROLLER (Modified for two-step registration)
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //validation
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

    // Find user and check if email is verified
    const user = await Users.findOne({ email: email });
    if (!user || !user.emailVerified) {
      return res.status(400).send({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Check if user already has password (already registered)
    if (user.password) {
      return res.status(409).send({
        success: false,
        message: "User already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Registration successful! Please login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in register API",
      error: error.message,
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
      // console.log("New Google user created:", user);
    } else {
      // console.log("Existing user found:", user);
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

//FACEBOOK LOGIN CONTROLLER
const facebookLoginController = async (req, res) => {
  try {
    const { name, email, facebookId } = req.body;
    let user = await Users.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await Users({
        name: name,
        email: email,
        facebookId: facebookId,
        isFacebookUser: "true",
      }).save();
      console.log("New Facebook user created:", user);
    } else {
      // Update existing user with Facebook info if needed
      if (!user.facebookId) {
        user.facebookId = facebookId;
        user.isFacebookUser = "true";
        // if (profilePicture) {
        //   user.profilePicture = profilePicture;
        // }
        await user.save();
      }
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
      message: "Facebook login success",
      token,
      user,
    });
  } catch (error) {
    console.log("Facebook login error:", error);
    return res.status(500).send({
      success: false,
      message: "Error in Facebook login API",
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

//SEND OTP TO PHONE NUMBER
// const sendOtpToPhoneNumberController = async (req, res) => {
//   const { phone } = req.body;

//   try {
//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const response = await axios.get(
//       // `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${phone}/AUTOGEN/`
//       `https://2factor.in/API/R1/?module=TRANS_SMS&apikey=${process.env.TWO_FACTOR_API_KEY}&to=${phone}&from=ZenOTP&templatename=OTP&var1=${otp}`
//     );
//     const { Details } = response.data;
//     console.log(Details);
//     res.status(200).json({ sessionId: Details });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// };

// VERIFY OTP FROM PHONE NUMBER
// const verifyOtpFromPhoneNumberController = async (req, res) => {
//   const { sessionId, otp } = req.body;

//   try {
//     const response = await axios.get(
//       `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
//     );

//     const { Status } = response.data;

//     if (Status === 'Success') {
//       res.status(200).json({ message: 'OTP Verified' });
//     } else {
//       res.status(400).json({ message: 'Invalid OTP' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'OTP verification failed' });
//   }
// }

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

    const { fullName, phone, address, city, state, pincode, country } =
      shippingAddress;
    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !country
    ) {
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
    const addressExists = user.shippingAddress.some(
      (addr) =>
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

    const { fullName, phone, address, city, state, pincode, country } =
      newAddress;
    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !country
    ) {
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
      const variant = product.variants?.find(
        (v) => v._id.toString() === cartItem.variantId
      );
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
      quantity: cartItem.quantity || 1,
    };

    if (cartItem.variantId) {
      newCartItem.variantId = cartItem.variantId;
    }

    user.cart.push(newCartItem);

    // Remove from wishlist if present
    if (user.wishlist.includes(cartItem.productId)) {
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

// 1. Send Reset Code
const sendResetCodeController = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .send({ success: false, message: "Email is required" });

  const user = await Users.findOne({ email });
  if (!user)
    return res
      .status(404)
      .send({ success: false, message: "No user found with this email" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000);

  user.resetPasswordCode = code;
  user.resetPasswordExpiry = expiry;
  user.resetPasswordVerified = false;
  await user.save();

  // Send code via email (reuse your Nodemailer transporter)
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${code}. It expires in 10 minutes.`,
    });
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
    // Don't fail the request if email fails, just log it
  }

  res.send({ success: true, message: "Reset code sent to your email" });
};

// 2. Verify Reset Code
const verifyResetCodeController = async (req, res) => {
  const { email, code } = req.body;
  const user = await Users.findOne({ email });
  if (!user || !user.resetPasswordCode || !user.resetPasswordExpiry)
    return res
      .status(400)
      .send({ success: false, message: "No reset request found" });

  if (user.resetPasswordCode !== code)
    return res.status(400).send({ success: false, message: "Invalid code" });

  if (user.resetPasswordExpiry < new Date())
    return res.status(400).send({ success: false, message: "Code expired" });

  user.resetPasswordVerified = true;
  await user.save();
  res.send({ success: true, message: "Code verified" });
};

// 3. Reset Password
const resetPasswordController = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (!user || !user.resetPasswordVerified)
    return res
      .status(400)
      .send({ success: false, message: "Code not verified" });

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordCode = null;
  user.resetPasswordExpiry = null;
  user.resetPasswordVerified = false;
  await user.save();

  res.send({ success: true, message: "Password reset successful" });
};

// Update FCM token for push notifications
const updateFCMToken = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fcmToken } = req.body;

    const user = await Users.findByIdAndUpdate(userId, 
      { fcmToken: fcmToken? fcmToken : null }, 
      { new: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "FCM token updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating FCM token",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  googleLoginController,
  facebookLoginController,
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
  sendOtpController,
  verifyOtpController,
  sendResetCodeController,
  verifyResetCodeController,
  resetPasswordController,
  updateFCMToken,
  // sendOtpToPhoneNumberController,
  // verifyOtpFromPhoneNumberController,
};
