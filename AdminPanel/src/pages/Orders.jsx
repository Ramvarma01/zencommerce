import React, { useState, useEffect, useRef, useContext } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { ProductContext } from '../context/productContext';

function Orders() {
  const [orders, setOrders] = useState([]);
  // const [products, setProducts] = useState([]);
  const [products, setProducts, fetchProducts] = useContext(ProductContext);
  const [menuOpen, setMenuOpen] = useState(null); // index of open menu
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen !== null &&
        cardRefs.current[menuOpen] &&
        !cardRefs.current[menuOpen].contains(event.target)
      ) {
        setMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/all-orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      alert('Failed to fetch orders');
      console.error(error);
    }
  };

  // const fetchProducts = async () => {
  //   try {
  //     const res = await axios.get('/get-products');
  //     if (res.data.success) {
  //       setProducts(res.data.products);
  //     }
  //   } catch (error) {
  //     alert('Failed to fetch products');
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const { data } = await axios.put(`/order-status/${orderId}`, { status });
      alert(data.message);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
      console.error(error);
    } finally {
      setMenuOpen(null);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const { data } = await axios.put(`/cancel-order/${orderId}`);
      alert(data.message);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to cancel order');
      console.error(error);
    } finally {
      setMenuOpen(null);
    }
  };

  // Helper to get product and variant details
  const getProductDetails = (item) => {
    const product = products.find((p) => p._id === item.productId);
    let variant = null;
    if (product && item.variantId) {
      variant = product.variants.find((v) => v._id === item.variantId);
    }
    return { product, variant };
  };

  // Helper to format shipping address
  const formatShippingAddress = (shippingAddress) => {
    if (!shippingAddress) return 'No address provided';
    
    const { fullName, phone, address, city, state, pincode, country } = shippingAddress;
    return `${fullName} (${phone})\n${address}\n${city}, ${state} ${pincode}\n${country}`;
  };

  // Helper to format order date
  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="products-container">
      <h1 className="products-title">All Orders</h1>
      <div className="products-grid">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, idx) => (
            <div
              className="form-card product-card-horizontal"
              key={order._id || idx}
              ref={el => (cardRefs.current[idx] = el)}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  {/* <h2 className="product-name">Order #{order._id.slice(-6)}</h2> */}
                  <h2 className="product-name">Order #{order._id}</h2>
                  <span className="menu-icon" onClick={() => setMenuOpen(menuOpen === idx ? null : idx)}>
                    <MoreVertIcon />
                  </span>
                </div>
                <p className="product-brand">Status: {order.Orderstatus}</p>
                <p className="product-quantity">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
                <p className="product-quantity">Total: ₹{order.totalAmount}</p>
                <p className="product-quantity">Date: {formatOrderDate(order.createdAt)}</p>
                
                {/* Shipping Address Section */}
                <div className="shipping-address-section">
                  <div className="shipping-address-header">
                    <LocationOnIcon style={{ color: '#6366f1', fontSize: 20 }} />
                    <span className="shipping-address-title">Shipping Address</span>
                  </div>
                  <div className="shipping-address-content">
                    {formatShippingAddress(order.shippingAddress)}
                    {/* <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.phone}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}</p>
                    <p>{order.shippingAddress.state}</p>
                    <p>{order.shippingAddress.pincode}</p>
                    <p>{order.shippingAddress.country}</p> */}
                  </div>
                </div>

                <div className="order-items-section">
                  <h4 className="order-items-title">Order Items:</h4>
                  {order.items.map((item, i) => {
                    const { product, variant } = getProductDetails(item);
                    return (
                      <div key={i} className="order-item-card">
                        {product && (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }}
                          />
                        )}
                        <div className="order-item-details">
                          <div className="order-item-name">{product ? product.name : item.productId}</div>
                          <div className="order-item-info">Qty: {item.quantity}</div>
                          <div className="order-item-info">Price: ₹{item.price}</div>
                          {variant && (
                            <div className="order-item-info">
                              {product.variantName}: {variant.name}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {menuOpen === idx && (
                <div className="product-menu">
                  <div onClick={() => handleStatusUpdate(order._id, 'Shipped')}>Mark as Shipped</div>
                  <div onClick={() => handleStatusUpdate(order._id, 'Delivered')}>Mark as Delivered</div>
                  <div onClick={() => handleCancel(order._id)}>Cancel Order</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;