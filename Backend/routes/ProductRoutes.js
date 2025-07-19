const express = require('express');
const { 
    addProductController,
    getAllProductsController,
    deleteProductController,
    duplicateProductController,
    editProductController,
    getProductByIdController
} = require('../controllers/ProductController');
const { upload } = require('../configCloudinary');

//router Object
const router = express.Router();

//middleware
const uploadMiddleware = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 6 },
    { name: 'variantImages', maxCount: 10 }
]);

//routes
router.post(
    '/add-product',
    uploadMiddleware,
    addProductController
);

// GET all products
router.get('/get-products', getAllProductsController);

// DELETE PRODUCT
router.delete("/delete-product/:id",deleteProductController);

//DUPLICATE PRODUCT
router.post("/duplicate-product/:id",duplicateProductController);

router.put(
    '/edit-product/:id',
    uploadMiddleware,
    editProductController
);

router.get("/product/:id", getProductByIdController);

module.exports = router;