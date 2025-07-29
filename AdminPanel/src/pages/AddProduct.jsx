import React, { useState, useContext, useRef } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveIcon from "@mui/icons-material/Remove";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { ProductContext } from "../context/productContext.jsx";

function AddProduct() {
  const [products, setProducts] = useContext(ProductContext);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    originalPrice: "",
    brand: "",
    category: "",
    quantity: "",
    thumbnail: "",
    images: [],
    variantName: "",
    variants: [],
    description: "",
  });

  const [hasVariant, setHasVariant] = useState(false);
  const [variantInput, setVariantInput] = useState({
    name: "",
    price: "",
    originalPrice: "",
    quantity: "",
    image: "",
  });

  const variantImageInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantInputChange = (e) => {
    const { name, value } = e.target;
    setVariantInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantImageChange = (e) => {
    const file = e.target.files[0];
    setVariantInput((prev) => ({
      ...prev,
      image: file || null,
    }));
  };

  const handleAddVariant = () => {
    if (
      variantInput.name &&
      variantInput.price &&
      variantInput.quantity &&
      variantInput.image
    ) {
      setProduct((prev) => ({
        ...prev,
        variants: [...prev.variants, { ...variantInput, id: Date.now() }],
      }));
      setVariantInput({
        name: "",
        price: "",
        originalPrice: "",
        quantity: "",
        image: "",
      });
      if (variantImageInputRef.current) {
        variantImageInputRef.current.value = "";
      }
    } else {
      alert(
        "Please fill in the variant name, price, quantity and image fields"
      );
    }
  };

  const handleRemoveVariant = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant, i) => i != index),
    }));
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    // files = URL.createObjectURL(files);
    if (type === "thumbnail") {
      setProduct((prev) => ({ ...prev, thumbnail: files[0] }));
      // setProduct(prev => ({ ...prev, thumbnail: URL.createObjectURL(files[0]) }));
    } else if (type === "images") {
      setProduct((prev) => {
        const currentImages = prev.images || [];
        const totalImages = currentImages.length + files.length;
        if (totalImages > 6) {
          alert("You can only upload up to 6 images.");
          // setImageLimitWarning('You can only upload up to 6 images.');
          const allowedFiles = files.slice(0, 6 - currentImages.length);
          return { ...prev, images: [...currentImages, ...allowedFiles] };
          // return { ...prev, images: [...currentImages, ...allowedFiles.map(file => URL.createObjectURL(file))] };
        } else {
          // setImageLimitWarning('');
          return { ...prev, images: [...currentImages, ...files] };
          // return { ...prev, images: [...currentImages, ...files.map(file => URL.createObjectURL(file))] };
        }
      });
    }
  };

  //HANDLE REMOVE IMAGE --> removes selected image from product.images
  const handleRemoveImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (hasVariant) {
        if (product.variants.length < 2) {
          alert("Please add at least two variant");
          return;
        }
      }
      if (product.thumbnail === "" || product.images.length === 0) {
        alert(
          "Please upload a thumbnail image and at least one additional image"
        );
        return;
      }

      const formData = new FormData();
      formData.append("thumbnail", product.thumbnail);

      const images = [];
      product.images.forEach((img) => {
        // images.push(img);
        formData.append("images", img);
      });
      // formData.append('images',JSON.stringify(images));
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("originalPrice", product.originalPrice);
      formData.append("brand", product.brand);
      formData.append("category", product.category);
      formData.append("quantity", product.quantity);
      formData.append("variantName", product.variantName);
      formData.append("description", product.description);
      formData.append("hasVariant", hasVariant);

      product.variants.forEach((variant, idx) => {
        formData.append(`variants[${idx}][name]`, variant.name);
        formData.append(`variants[${idx}][price]`, variant.price);
        formData.append(
          `variants[${idx}][originalPrice]`,
          variant.originalPrice
        );
        formData.append(`variants[${idx}][quantity]`, variant.quantity);
        if (variant.image) {
          formData.append("variantImages", variant.image);
        }
      });

      const { data } = await axios.post("/add-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        alert("Product added successfully");
        setProducts((prev) => [...prev, data.product]);
        setProduct({
          name: "",
          price: "",
          originalPrice: "",
          brand: "",
          category: "",
          quantity: "",
          thumbnail: "",
          images: [],
          variantName: "",
          variants: [],
          description: "",
        });
        setVariantInput({
          name: "",
          price: "",
          originalPrice: "",
          quantity: "",
          image: "",
        });
        setHasVariant(false);
      }
      // }else{
      // alert(data.message);
      // }
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="form-container">
      {/* Header */}
      <div className="form-header">
        <h1 className="form-title">Add New Product</h1>
        <p className="form-subtitle">
          Fill in the product details below to add a new item to your store
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Basic Information Section */}
          <div className="form-card">
            <div className="card-title">
              <span className="card-title-icon">
                <AddBoxIcon />
              </span>
              Basic Information
            </div>
            <div className="form-row">
              <div className="form-field mb-2">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="form-field mb-2">
                <label className="form-label">Brand Name</label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter brand name"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field mb-2">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="form-input"
                  required
                  defaultValue={product.category}
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home</option>
                  <option value="sports">Sports</option>
                  <option value="books">Books</option>
                </select>
              </div>
            </div>
            <div className="form-field mb-2">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="form-input form-textarea"
                placeholder="Enter product description"
                rows="4"
              />
            </div>
            <div className="form-checkbox">
              <input
                type="checkbox"
                id="hasVariant"
                checked={hasVariant}
                onChange={(e) => setHasVariant(e.target.checked)}
                className="checkbox-input"
              />
              <label htmlFor="hasVariant" className="checkbox-label">
                This product has variants (e.g., different sizes, colors)
              </label>
            </div>
          </div>

          {/* Pricing and Inventory Section (show only if hasVariant is false) */}
          {!hasVariant && (
            <div className="form-card">
              <div className="card-title">
                <span className="card-title-icon">
                  <AddBoxIcon />
                </span>
                Pricing Information
              </div>
              <div className="form-row">
                <div className="form-field mb-2">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-field mb-2">
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={product.originalPrice}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>
          )}

          {/* Variants Section (show only if hasVariant is true) */}
          {hasVariant && (
            <div className="form-card">
              <div className="card-title">
                <span className="card-title-icon">
                  <AddBoxIcon />
                </span>
                Product Variants
              </div>
              <div className="form-field mb-2">
                <label className="form-label">
                  Variant Group Name (e.g. Size, Color, Material)
                </label>
                <input
                  type="text"
                  name="variantName"
                  value={product.variantName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter variant group name"
                  required
                />
              </div>
              <div>
                {/* <form onSubmit={handleAddVariant}> */}
                <p className="form-subtitle mb-2">Add Variant Options</p>
                <div className="form-row mb-2">
                  <div className="form-field">
                    <label className="form-label">Variant Name</label>
                    <input
                      type="text"
                      name="name"
                      value={variantInput.name}
                      onChange={handleVariantInputChange}
                      className="form-input"
                      placeholder="e.g. Small, Red, Cotton"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={variantInput.price}
                      onChange={handleVariantInputChange}
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Original Price (₹)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={variantInput.originalPrice}
                      onChange={handleVariantInputChange}
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      value={variantInput.quantity}
                      onChange={handleVariantInputChange}
                      className="form-input"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="form-field variant-image-field">
                    <div>
                      <label className="form-label">Variant Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleVariantImageChange}
                        ref={variantImageInputRef}
                      />
                    </div>
                    <div>
                      {variantInput.image && (
                        <img
                          src={URL.createObjectURL(variantInput.image)}
                          alt="Variant Preview"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-field">
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="button button-secondary"
                  >
                    <span className="button-icon">
                      <AddBoxIcon />
                    </span>
                    Add
                  </button>
                </div>
                {/* </form> */}
              </div>
              {/* Display added variants */}
              {product.variants.length > 0 && (
                <div className="variant-chips">
                  {product.variants.map((variant, idx) => (
                    <div key={variant.id} className="variant-chip">
                      {variant.image && (
                        <img
                          src={URL.createObjectURL(variant.image)}
                          alt="Variant"
                          style={{
                            width: 24,
                            height: 24,
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: 8,
                          }}
                        />
                      )}
                      {variant.name} - ₹{variant.price}
                      <span
                        className="chip-remove"
                        onClick={() => handleRemoveVariant(idx)}
                      >
                        <RemoveIcon fontSize="small" />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Media Section */}
          <div className="form-card">
            <div className="card-title">
              <span className="card-title-icon">
                <AddBoxIcon />
              </span>
              Product Media
            </div>

            <div className="form-field mb-3">
              <label className="form-label">Product Thumbnail</label>
              <div className="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "thumbnail")}
                  style={{ display: "none" }}
                  id="thumbnail-upload"
                />
                <label htmlFor="thumbnail-upload">
                  <div className="file-upload-icon">
                    <CloudUploadIcon />
                  </div>
                  <div className="file-upload-text">
                    Click to upload thumbnail image
                  </div>
                </label>
              </div>
              {product.thumbnail && (
                <div className="mt-2">
                  <p className="form-subtitle">Selected images:</p>
                  <div className="selected-thumbnail">
                    <img
                      src={URL.createObjectURL(product.thumbnail)}
                      alt="Product"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="form-field">
              <label className="form-label">Additional Images</label>
              <div className="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, "images")}
                  style={{ display: "none" }}
                  id="images-upload"
                  disabled={product.images.length >= 6}
                />
                <label htmlFor="images-upload">
                  <div className="file-upload-icon">
                    <CloudUploadIcon />
                  </div>
                  <div className="file-upload-text">
                    Click to upload additional images
                  </div>
                </label>
              </div>
              {product.images.length > 0 && (
                <div className="mt-2">
                  <p className="form-subtitle">Selected images:</p>
                  <div className="selected-images">
                    {product.images.map((img, index) => (
                      <div className="selected-image-item">
                        <div key={index}>
                          <img src={URL.createObjectURL(img)} alt="Product" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="button"
                        >
                          Remove
                          {/* <RemoveIcon fontSize="small" /> */}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-3">
          <button type="submit" className="button button-primary">
            <span className="button-icon">
              <SaveIcon />
            </span>
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
