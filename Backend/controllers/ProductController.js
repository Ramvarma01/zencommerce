const products = require("../models/Products");

//ADD PRODUCT CONTROLLER
const addProductController = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      category,
      price,
      originalPrice,
      quantity,
      hasVariant,
      variantName,
      variants,
    } = req.body;

    // Get Cloudinary URLs and original filenames
    const thumbnailFile = req.files["thumbnail"]
      ? req.files["thumbnail"][0]
      : null;
    const thumbnailUrl = thumbnailFile ? thumbnailFile.path : "";
    // const thumbnailOriginalName = thumbnailFile ? thumbnailFile.originalname : '';

    const imageFiles = req.files["images"] ? req.files["images"] : [];
    const imagesUrls = imageFiles.map((f) => f.path);
    // const imagesOriginalNames = imageFiles.map(f => f.originalname);

    // Handle variant images
    const variantImageFiles = req.files["variantImages"]
      ? req.files["variantImages"]
      : [];

    // Process variants with images
    let processedVariants = [];
    if (variants) {
      try {
        processedVariants = variants.map((variant, index) => ({
          ...variant,
          image: variantImageFiles[index]
            ? variantImageFiles[index].path
            : variant.image || "",
        }));
      } catch (error) {
        console.error("Error processing variants:", error);
        // processedVariants = [];
      }
    }
    const newProduct = new products({
      name,
      brand,
      description,
      category,
      price,
      originalPrice,
      quantity,
      thumbnail: thumbnailUrl,
      // thumbnailOriginalName: thumbnailOriginalName,
      images: imagesUrls,
      // imagesOriginalNames: imagesOriginalNames,
      hasVariant,
      variantName,
      variants: processedVariants,
      isNewProduct: "true",
    });
    await newProduct.save();

    res.status(200).send({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS CONTROLLER
const getAllProductsController = async (req, res) => {
  try {
    const allProducts = await products.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      products: allProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//EDIT PRODUCT CONTROLLER
const editProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      brand,
      description,
      category,
      price,
      originalPrice,
      quantity,
      hasVariant,
      variantName,
      variants,
      existingImages,
      existingthumbnail,
      existingVariantImages,
      variantImageIndexes,
    } = req.body;

    // Get Cloudinary URLs and original filenames
    const thumbnailFile = req.files["thumbnail"]
      ? req.files["thumbnail"][0]
      : null;
    const thumbnailUrl = thumbnailFile ? thumbnailFile.path : existingthumbnail;
    // const thumbnailOriginalName = thumbnailFile ? thumbnailFile.originalname : '';

    let imagesUrls = [];
    if (existingImages) {
      if (typeof existingImages === "string") {
        try {
          imagesUrls = JSON.parse(existingImages);
        } catch (e) {
          imagesUrls = [];
        }
      } else {
        imagesUrls = existingImages;
      }
    }
    const imageFiles = req.files["images"] ? req.files["images"] : [];
    imagesUrls = [...imagesUrls, ...imageFiles.map((f) => f.path)];

    // Handle variant images
    const variantImageFiles = req.files["variantImages"]
      ? req.files["variantImages"]
      : [];

    // Process variants with images
    let processedVariants = [];
    if (variants && hasVariant) {
      try {
        // Parse existingVariantImages if it's a string
        let existingVariantImagesArr = [];
        if (existingVariantImages) {
          if (typeof existingVariantImages === "string") {
            try {
              existingVariantImagesArr = JSON.parse(existingVariantImages);
            } catch (e) {
              existingVariantImagesArr = [];
            }
          } else {
            existingVariantImagesArr = existingVariantImages;
          }
        }

        let idx = 0;
        processedVariants = variants.map((variant, index) => {
          let image = "";
          if (existingVariantImagesArr && existingVariantImagesArr[index]) {
            image = existingVariantImagesArr[index];
            console.log(index + image);
          }
          // If a new image was uploaded for this variant, use it
          else if (
            variantImageFiles &&
            variantImageFiles[idx] &&
            variantImageFiles[idx].path
          ) {
            image = variantImageFiles[idx].path;
            console.log(index + image);
            idx++;
          }
          return {
            ...variant,
            image,
          };
        });
      } catch (error) {
        console.error("Error processing variants:", error);
        processedVariants = [];
      }
    }

    // Update the existing product
    const updatedProduct = await products.findByIdAndUpdate(
      id,
      {
        name,
        brand,
        description,
        category,
        // price: hasVariant? '': price,
        // originalPrice: hasVariant? '': originalPrice,
        // quantity:hasVariant? '': originalPrice,
        price,
        originalPrice,
        quantity,
        thumbnail: thumbnailUrl,
        // thumbnailOriginalName: thumbnailOriginalName,
        images: imagesUrls,
        // imagesOriginalNames: imagesOriginalNames,
        hasVariant,
        // variantName: hasVariant? variantName: '',
        variantName,
        variants: processedVariants,
        isNewProduct: "true",
      },
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

//DELETE PRODUCT CONTROLLER
const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    await products.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in delete product api",
      error,
    });
  }
};

//DUPLICATE PRODUCT
const duplicateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const original = await products.findById({ _id: id }).lean();
    if (original) {
      delete original._id; // Remove _id so MongoDB can generate a new one
      const duplicate = new products(original);
      await duplicate.save();
    } else {
      res.status(400).send({
        success: false,
        message: "Product not found",
      });
    }
    // await products.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Product duplicated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in duplicate product api",
      error,
    });
  }
};

// Get single product by ID
const getProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await products.findById(id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

module.exports = {
  addProductController,
  getAllProductsController,
  deleteProductController,
  duplicateProductController,
  editProductController,
  getProductByIdController,
};
