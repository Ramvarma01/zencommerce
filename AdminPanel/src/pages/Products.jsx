import React, { useContext, useState, useEffect, useRef } from "react";
import { ProductContext } from "../context/productContext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../components/Modal"

function Products() {
  const [products, setProducts, fetchProducts] = useContext(ProductContext);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [menuOpen, setMenuOpen] = useState(null); // index of open menu
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  // const location = useLocation();
  // const { product } = location.state || {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen !== null) {
        // Check if the click is outside the menu
        const menuElement = document.querySelector(".product-menu");
        const menuIcon = event.target.closest(".menu-icon");
        if (menuElement && !menuElement.contains(event.target) && !menuIcon) {
          setMenuOpen(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // const handleMenuAction = (action, product) => {
  //   // Placeholder for edit, delete, duplicate logic
  //   alert(`${action} clicked for ${product.name}`);
  //   setMenuOpen(null);
  // };

  // GET Qunatityt SUM --> if product has varients i.e sum of all varients
  const getQuantitySum = (variants) => {
    if (!Array.isArray(variants)) return 0;
    return variants.reduce(
      (sum, variant) => sum + (Number(variant.quantity) || 0),
      0
    );
  };

  // HANDLE EDIT PRODUCT
  const handleEdit = async (prod) => {
    navigate("/products/editproduct", { state: { prod } });
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  // HANDLE DELETE PRODUCTS
  const handleDelete = async (productId) => {
    try {
      const { data } = await axios.delete(`/delete-product/${productId}`);
      alert(data?.message);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message);
      console.log(error);
    } finally {
      setDeleteModalOpen(false);
      setMenuOpen(null);
    }
  };

  // HANDLE DUPLICATE PRODUCTS
  const handleDuplicate = async (productId) => {
    try {
      const { data } = await axios.post(`/duplicate-product/${productId}`);
      alert(data?.message);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message);
      console.log(error);
    } finally {
      setMenuOpen(null);
    }
  };

  return (
    <div data-page="Products" className="products-container">
      <h1 className="products-title">All Products</h1>

      {/* <div>
      <h1>My React Website</h1>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2>Hello 👋</h2>
        <p>This is a custom modal in React.</p>
      </Modal>
    </div> */}

      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product, idx) => (
            <div
              className="form-card product-card-horizontal"
              key={product._id || idx}
              ref={(el) => (cardRefs.current[idx] = el)}
            >
              <img
                src={product.thumbnail}
                alt={product.name}
                className="product-thumbnail"
              />
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <h2 className="product-name">{product.name}</h2>
                  <span
                    className="menu-icon"
                    onClick={() => {
                      setMenuOpen(menuOpen === idx ? null : idx);
                    }}
                  >
                    <MoreVertIcon />
                  </span>
                </div>
                <p className="product-brand">Brand: {product.brand}</p>
                {product.quantity !== undefined &&
                product.quantity !== null &&
                product.quantity !== "" ? (
                  <p className="product-quantity">
                    Quantity: {product.quantity}
                  </p>
                ) : (
                  <p className="product-quantity">
                    Quantity: {getQuantitySum(product.variants)}
                  </p>
                )}
              </div>
              {menuOpen === idx && (
                <div className="product-menu">
                  <div onClick={() => handleEdit(product)}>Edit</div>
                  {/* <div onClick={() => handleDelete(product._id)}>Delete</div> */}
                  <div onClick={() => openDeleteModal(product)}>Delete </div>
                  <div onClick={() => handleDuplicate(product._id)}>
                    Duplicate
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div>
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        >
          <h3 style={{ marginBottom: 10 }}>Confirm Delete</h3>
          <p class="mb-2">
            Are you sure you want to delete "{selectedProduct.name}"
          </p>
          <div style={{ display: "flex", flexDirection: "row-reverse" }}>
            <button
              style={{ marginLeft: 10, width: "30%", backgroundColor: "#ff6b6b" }}
              onClick={() => handleDelete(selectedProduct._id)}
            >
              Delete
            </button>
            <button
              style={{ width: "30%", backgroundColor: "#4A4A5F"}}
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Products;
