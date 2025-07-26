const express = require('express');
const { 
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
} = require('../controllers/UserController');

//router Object
const router = express.Router();

//routes
router.post('/register', registerController);
router.post('/login', loginController);
router.post('/google-login', googleLoginController);
router.put("/update-user", updateUserController);
router.put("/update-password", updatePasswordController);
router.post("/add-shipping-address", addShippingAddressController);
router.put("/delete-shipping-address", deleteShippingAddressController);
router.put("/update-shipping-address", updateShippingAddressController);
router.put("/set-default-address", setDefaultAddressController);
router.put("/add-product-to-wishlist/:id",addProductToWishlistController);
router.delete("/remove-product-from-wishlist/:id", removeProductFromWishlistController);
router.delete("/clear-wishlist/:id", clearWishlistController);
router.put("/add-product-to-cart/:id",addProductToCartController);
router.delete("/remove-product-from-cart/:id", removeProductFromCartController);

module.exports = router;