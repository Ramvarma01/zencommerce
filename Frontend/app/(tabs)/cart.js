import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductContext } from "../../context/productContext";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RazorpayCheckout from "react-native-razorpay";
const { width } = Dimensions.get("window");

const CartPage = () => {
  const [products, , fetchProducts] = useContext(ProductContext);
  const [state, setState, getLocalStorageData] = useContext(AuthContext);
  const { user, token } = state;

  // Helper to create a unique key for each cart item (product + variant)
  const getCartItemKey = (item) =>
    item._id + (item.variantId ? `-${item.variantId}` : "");

  // Compute cart items from user.cart and products
  const cartItems = useMemo(
    () =>
      user?.cart
        ?.map((cartItem) => {
          const product = products.find((p) => p._id === cartItem.productId);
          return product
            ? {
                ...product,
                cartQuantity: cartItem.quantity,
                variantId: cartItem.variantId,
              }
            : null;
        })
        .filter(Boolean).reverse() || [],
    [user, products]
  );

  // Selection state (by unique cart item key)
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectionInitialized, setSelectionInitialized] = useState(false);
  const [shippingOption, setShippingOption] = useState("standard");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("online"); // "cod" or "online"
  const [placingOrder, setPlacingOrder] = useState(false);

  // Set default address when modal opens
  useEffect(() => {
    if (showAddressModal && user?.shippingAddress?.length > 0) {
      const defaultIdx = user.defaultAddressIndex || 0;
      setSelectedAddressIdx(defaultIdx);
    }
  }, [showAddressModal, user]);

  useEffect(() => {
    // When cartItems are loaded or changed, select all of them by default.
    const cartItemKeys = cartItems.map(getCartItemKey);
    setSelectedItems(new Set(cartItemKeys));
    if (cartItems.length > 0) {
      setSelectionInitialized(true);
    } else {
      // Reset if cart becomes empty
      setSelectionInitialized(false);
    }
  }, [cartItems]);

  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 20,
      time: "3-5 business days",
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 12.99,
      time: "1-2 business days",
    },
  ];

  const coupons = [
    { code: "ZEN10", discount: 10, type: "percentage" },
    { code: "SAVE50", discount: 50, type: "fixed" },
  ];

  const handleApplyCoupon = () => {
    const foundCoupon = coupons.find(
      // (c) => c.code.toLowerCase() === couponCode.toLowerCase()
      (c) => c.code === couponCode
    );
    if (foundCoupon) {
      setAppliedCoupon(foundCoupon);
      Alert.alert("Success", "Coupon applied successfully!");
    } else {
      setAppliedCoupon(null);
      Alert.alert("Error", "Invalid coupon code.");
    }
  };

  // Calculate totals
  const selectedItemsList = cartItems.filter((item) =>
    selectedItems.has(getCartItemKey(item))
  );

  const subtotal = selectedItemsList.reduce((sum, item) => {
    if (item.hasVariant && item.variantId) {
      const variant = item.variants.find((v) => v._id === item.variantId);
      return sum + (variant ? variant.price : 0);
    }
    return sum + item.price;
  }, 0);

  const totalSavings = selectedItemsList.reduce((sum, item) => {
    if (item.hasVariant && item.variantId) {
      const variant = item.variants.find((v) => v._id === item.variantId);
      return sum + (variant ? variant.originalPrice - variant.price : 0);
    }
    return sum + (item.originalPrice - item.price);
  }, 0);
  const shippingCost =
    selectedItemsList.length > 0
      ? shippingOptions.find((option) => option.id === shippingOption)?.price ||
        0
      : 0;
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percentage") {
      return (subtotal * appliedCoupon.discount) / 100;
    }
    if (appliedCoupon.type === "fixed") {
      return appliedCoupon.discount;
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  // Payment method charge
  const paymentMethodCharge = paymentMethod === "cod" ? 40 : 0;

  const total = subtotal - couponDiscount + shippingCost + paymentMethodCharge;

  // Remove from cart (backend + context)
  const removeItem = async (productId, variantId) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // Check if user is logged in
              if (!user || !user._id) {
                Alert.alert(
                  "Error",
                  "Please login to remove products from cart"
                );
                return;
              }
              const { data } = await axios.delete(
                `/remove-product-from-cart/${user._id}`,
                { data: { product_id: productId, variant_id: variantId } }
              );
              if (data.success) {
                await AsyncStorage.setItem(
                  "@auth",
                  JSON.stringify({ user: data.user })
                );
                getLocalStorageData();
                Alert.alert(data.message);
              }
            } catch (error) {
              const errorMessage =
                error.response?.data?.message ||
                "Error removing product from cart";
              Alert.alert("Error", errorMessage);
              console.error("Error removing product from cart:", error);
            }
          },
        },
      ]
    );
  };

  // Toggle selection
  const toggleItemSelection = (item) => {
    const itemKey = getCartItemKey(item);
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  // Check if all items are selected
  const allItemsSelected =
    cartItems.length > 0 && selectedItems.size === cartItems.length;

  // Toggle all
  const toggleAllItems = () => {
    if (allItemsSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(getCartItemKey)));
    }
  };

  // Move to wishlist (backend + context)
  const moveToWishlist = async (product) => {
    try {
      if (user.wishlist.includes(product._id)) {
        return Alert.alert("Product already in wishlist");
      }
      const { data } = await axios.put(`/add-product-to-wishlist/${user._id}`, {
        product_id: product._id,
      });
      if (data.success) {
        await AsyncStorage.setItem(
          "@auth",
          JSON.stringify({ user: data.user })
        );
        getLocalStorageData();
        Alert.alert(data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error adding product to wishlist";
      Alert.alert("Error", errorMessage);
      console.error("Error adding product to wishlist:", error);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      Alert.alert("Empty Cart", "Please select items to checkout.");
      return;
    }
    // Check for phone
    if (!user?.phone || !/^\d{10}$/.test(user.phone)) {
      Alert.alert(
        "Phone Number Required",
        "Please add your phone number."
      );
      router.push("../(profile)/editProfile");
      return;
    }
    // Check for shipping address
    if (
      !user?.shippingAddress ||
      !Array.isArray(user.shippingAddress) ||
      user.shippingAddress.length === 0
    ) {
      Alert.alert(
        "Shipping Address Required",
        "Please add a shipping address"
      );
      router.push("../(profile)/shippingAddress");
      return;
    }
    // Both present, show address selection modal
    setShowAddressModal(true);
  };

  const handleProductPress = (product) => {
    router.push(`/product/${product._id}`);
  };

  // Add this helper to get max quantity for a cart item
  const getMaxQuantity = (item) => {
    if (item.hasVariant && item.variantId) {
      const variant = item.variants.find((v) => v._id === item.variantId);
      return variant ? variant.quantity : 1;
    }
    return item.quantity;
  };

  // Add this function to update cartQuantity in the user.cart array in AuthContext
  const updateCartQuantity = (item, newQuantity) => {
    // Find the cart item in user.cart
    const cartIndex = user.cart.findIndex(
      (cartItem) =>
        cartItem.productId === item._id &&
        (item.hasVariant ? cartItem.variantId === item.variantId : true)
    );
    if (cartIndex === -1) return;
    // Clamp newQuantity between 1 and max
    const max = getMaxQuantity(item);
    const clamped = Math.max(1, Math.min(newQuantity, max));
    user.cart[cartIndex].quantity = clamped;
    // Update context state
    setState({ ...state, user: { ...user, cart: [...user.cart] } });
  };

  // Update renderCartItem to use _id
  const renderCartItem = (item) => (
    <TouchableOpacity
      key={getCartItemKey(item)}
      style={styles.cartItem}
      onPress={() => handleProductPress(item)}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleItemSelection(item)}
      >
        <Ionicons
          name={
            selectedItems.has(getCartItemKey(item))
              ? "checkbox"
              : "square-outline"
          }
          size={24}
          color={selectedItems.has(getCartItemKey(item)) ? "#007AFF" : "#666"}
        />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.thumbnail }} style={styles.itemImage} />
        {item.quantity === 0 && (
          <Text style={styles.outOfStockText}>Out of Stock</Text>
        )}
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemBrand} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        {/* Show variant name if present */}
        {item.hasVariant &&
          item.variantId &&
          (() => {
            const selectedVariant = item.variants.find(
              (v) => v._id === item.variantId
            );
            return selectedVariant ? (
              <Text style={styles.variantName} numberOfLines={1}>
                {item.variantName}: {selectedVariant.name}
              </Text>
            ) : null;
          })()}
        <View style={styles.priceContainer}>
          {item.hasVariant && item.variantId ? (
            (() => {
              // Find the specific variant based on variantId
              const selectedVariant = item.variants.find(
                (variant) => variant._id === item.variantId
              );
              if (selectedVariant) {
                return (
                  <>
                    <Text style={styles.currentPrice}>
                      ₹{selectedVariant.price}
                    </Text>
                    {/* <Text style={styles.originalPrice}>
                      ₹{selectedVariant.originalPrice}
                    </Text> */}
                    <Text style={styles.savingsText}>
                      Save ₹
                      {(
                        selectedVariant.originalPrice - selectedVariant.price
                      ).toFixed(2)}
                    </Text>
                  </>
                );
              }
              // else {
              //   // Fallback to first variant if selected variant not found
              //   return (
              //     <>
              //       <Text style={styles.currentPrice}>₹{item.variants[0].price}</Text>
              //       <Text style={styles.originalPrice}>
              //         ₹{item.variants[0].originalPrice}
              //       </Text>
              //       <Text style={styles.savingsText}>
              //         Save ₹{(item.variants[0].originalPrice - item.variants[0].price).toFixed(2)}
              //       </Text>
              //     </>
              //   );
              // }
            })()
          ) : (
            <>
              <Text style={styles.currentPrice}>₹{item.price}</Text>
              {/* <Text style={styles.originalPrice}>₹{item.originalPrice}</Text> */}
              <Text style={styles.savingsText}>
                Save ₹{(item.originalPrice - item.price).toFixed(2)}
              </Text>
            </>
          )}
        </View>
        <View style={styles.actionContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation && e.stopPropagation();
                updateCartQuantity(item, item.cartQuantity - 1);
              }}
              disabled={item.cartQuantity <= 1}
            >
              <Ionicons
                name="remove"
                size={18}
                color={item.cartQuantity <= 1 ? "#ccc" : "#007AFF"}
              />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.cartQuantity}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation && e.stopPropagation();
                updateCartQuantity(item, item.cartQuantity + 1);
              }}
              disabled={item.cartQuantity >= getMaxQuantity(item)}
            >
              <Ionicons
                name="add"
                size={18}
                color={
                  item.cartQuantity >= getMaxQuantity(item) ? "#ccc" : "#007AFF"
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtons}>
            {/* <View style={{ flex: 1, marginRight: 70 }} /> */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => moveToWishlist(item)}
            >
              <Ionicons name="heart-outline" size={16} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => removeItem(item._id, item.variantId)}
            >
              <Ionicons name="trash-outline" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCouponCode = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Coupon Code</Text>
      <View style={styles.couponContainer}>
        <TextInput
          style={styles.couponInput}
          placeholder="Enter coupon code"
          value={couponCode}
          onChangeText={setCouponCode}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={[styles.applyButton]}
          onPress={handleApplyCoupon}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
      {appliedCoupon && (
        <Text style={styles.appliedCouponText}>
          Applied "{appliedCoupon.code}": -₹{couponDiscount.toFixed(2)}
        </Text>
      )}
    </View>
  );

  // Payment method selection UI
  const renderPaymentMethod = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={{ flexDirection: "clomun", gap: 10 }}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "cod" && styles.selectedPaymentOption,
          ]}
          onPress={() => setPaymentMethod("cod")}
        >
          <Ionicons
            name={
              paymentMethod === "cod" ? "radio-button-on" : "radio-button-off"
            }
            size={20}
            color={paymentMethod === "cod" ? "#007AFF" : "#666"}
          />
          <Text style={styles.paymentOptionText}>
            Cash on Delivery (₹40 extra)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "online" && styles.selectedPaymentOption,
          ]}
          onPress={() => setPaymentMethod("online")}
        >
          <Ionicons
            name={
              paymentMethod === "online"
                ? "radio-button-on"
                : "radio-button-off"
            }
            size={20}
            color={paymentMethod === "online" ? "#007AFF" : "#666"}
          />
          <Text style={styles.paymentOptionText}>
            Online Payment (No extra charge)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.orderSummary}>
      <Text style={styles.summaryTitle}>Order Summary</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>
          Subtotal ({selectedItemsList.length} items)
        </Text>
        <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
      </View>

      {appliedCoupon && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Coupon Discount</Text>
          <Text style={[styles.summaryValue, { color: "#4CAF50" }]}>
            -₹{couponDiscount.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping</Text>
        <Text style={styles.summaryValue}>₹{shippingCost.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Payment Method</Text>
        <Text style={styles.summaryValue}>
          {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Payment Charges</Text>
        <Text style={styles.summaryValue}>
          ₹{paymentMethodCharge.toFixed(2)}
        </Text>
      </View>

      {totalSavings > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Savings</Text>
          <Text style={[styles.summaryValue, { color: "#4CAF50" }]}>
            -₹{totalSavings.toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.summaryDivider} />

      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <Ionicons name="cart-outline" size={80} color="#D3D3D3" />
      <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
      <Text style={styles.emptyCartSubtitle}>
        Add some products to your cart to get started
      </Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  // Address selection modal
  const renderAddressModal = () => (
    <Modal
      visible={showAddressModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddressModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Delivery Address</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            {user.shippingAddress.map((address, idx) => (
              <Pressable
                key={idx}
                style={[
                  styles.addressCard,
                  selectedAddressIdx === idx && styles.selectedAddressCard,
                ]}
                onPress={() => setSelectedAddressIdx(idx)}
              >
                <Text style={styles.addressName}>{address.fullName}</Text>
                <Text style={styles.addressText}>Phone: {address.phone}</Text>
                <Text style={styles.addressText}>
                  Address: {address.address}, {address.city}, {address.state},{" "}
                  {address.pincode}, {address.country}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
              gap: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => setShowAddressModal(false)}
              style={[styles.applyButton, { backgroundColor: "#ccc" }]}
            >
              <Text style={[styles.applyButtonText, { color: "#333" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.applyButton,
                {
                  opacity:
                    selectedAddressIdx === null || placingOrder ? 0.5 : 1,
                },
              ]}
              disabled={selectedAddressIdx === null || placingOrder}
              onPress={placeOrder}
            >
              <Text style={styles.applyButtonText}>
                {placingOrder
                  ? "Placing Order..."
                  : "Deliver Here & Place Order"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Place order function
  const placeOrder = async () => {
    if (selectedAddressIdx === null) {
      Alert.alert("Select Address", "Please select a delivery address.");
      return;
    }
    setPlacingOrder(true);
    try {
      // Prepare order items
      const items = selectedItemsList.map((item) => {
        return {
          productId: item._id,
          quantity: item.cartQuantity,
          price:
            item.hasVariant && item.variantId
              ? item.variants.find((v) => v._id === item.variantId)?.price ||
                item.price
              : item.price,
          variantId: item.hasVariant ? item.variantId : undefined,
        };
      });
      const orderPayload = {
        user: user._id,
        items,
        shippingAddress: user.shippingAddress[selectedAddressIdx],
        paymentMethod: paymentMethod === "cod" ? "COD" : "Online",
        totalAmount: total,
      };
      if (paymentMethod === "online") {
        // 1. Create Razorpay order on backend
        const { data: razorpayData } = await axios.post(
          "/create-razorpay-order",
          {
            amount: total,
            currency: "INR",
          }
        );
        if (!razorpayData.success)
          throw new Error(
            razorpayData.message || "Failed to create Razorpay order"
          );
        const { id: razorpayOrderId, amount: razorpayAmount } =
          razorpayData.order;
        // 2. Open Razorpay payment UI
        const options = {
          description: "Order Payment",
          image:
            "https://res.cloudinary.com/dg1wavm3u/image/upload/v1753352208/zencommerce_logo_jyhhkt.png", // Replace with your logo
          currency: "INR",
          key: "rzp_test_PzGN0iD8UN5M5F", // Replace with your Razorpay key id
          amount: razorpayAmount,
          order_id: razorpayOrderId,
          name: "Zencommerce",
          prefill: {
            email: user.email,
            contact: user.phone,
            name: user.name,
          },
          theme: { color: "#007AFF" },
          method: {
            netbanking: true,
            card: true,
            upi: true, // <-- This enables UPI
            wallet: true,
          },
        };
        RazorpayCheckout.open(options)
          .then(async (paymentData) => {
            // 3. Verify payment on backend and create order
            const verifyPayload = {
              razorpay_order_id: paymentData.razorpay_order_id,
              razorpay_payment_id: paymentData.razorpay_payment_id,
              razorpay_signature: paymentData.razorpay_signature,
              orderPayload,
            };
            const { data: verifyData } = await axios.post(
              "/verify-razorpay-payment",
              verifyPayload
            );
            if (verifyData.success) {
              await AsyncStorage.setItem(
                "@auth",
                JSON.stringify({ user: verifyData.userDetails })
              );
              getLocalStorageData();
              Alert.alert(
                "Order Placed",
                "Your payment was successful and order has been placed!"
              );
              setShowAddressModal(false);
              setSelectedAddressIdx(null);
            } else {
              Alert.alert(
                "Payment Verification Failed",
                verifyData.message || "Could not verify payment."
              );
            }
          })
          .catch((error) => {
            Alert.alert(
              "Payment Failed",
              error.description || error.message || "Payment was not completed."
            );
          })
          .finally(() => {
            setPlacingOrder(false);
          });
        return;
      }
      // COD fallback
      const { data } = await axios.post("/create-order", orderPayload);
      if (data.success) {
        await AsyncStorage.setItem(
          "@auth",
          JSON.stringify({ user: data.userDetails })
        );
        getLocalStorageData();
        Alert.alert("Order Placed", "Your order has been placed successfully!");
        setShowAddressModal(false);
        setSelectedAddressIdx(null);
      } else {
        Alert.alert("Order Failed", data.message || "Could not place order.");
      }
    } catch (error) {
      Alert.alert(
        "Order Failed",
        error.response?.data?.message ||
          error.message ||
          "Could not place order."
      );
      setPlacingOrder(false);
    } finally {
      if (paymentMethod !== "online") setPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderAddressModal()}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        {selectionInitialized && cartItems.length > 0 && (
          <TouchableOpacity onPress={toggleAllItems}>
            <Text style={styles.selectAllText}>
              {allItemsSelected ? "Deselect All" : "Select All"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {cartItems.length > 0 ? (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
           keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cartItemsContainer}>
            {cartItems.map(renderCartItem)}
          </View>

          {renderCouponCode()}
          {renderPaymentMethod()}
          {/* {renderShippingOptions()} */}
          {renderOrderSummary()}
          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        renderEmptyCart()
      )}
      {cartItems.length > 0 && (
        <View style={styles.checkoutContainer}>
          <View style={styles.checkoutInfo}>
            <Text style={styles.checkoutLabel}>
              Total ({selectedItemsList.length} items)
            </Text>
            <Text style={styles.checkoutTotal}>₹{total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              selectedItems.size === 0 && styles.disabledCheckoutButton,
            ]}
            onPress={handleCheckout}
            disabled={selectedItems.size === 0}
          >
            <Text style={styles.checkoutButtonText}>
              {selectedItems.size === 0
                ? "Select Items"
                : "Proceed to Checkout"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    // paddingTop: 35,
    paddingVertical: 10,
    // paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  selectAllText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  cartItemsContainer: {
    paddingHorizontal: 15,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkbox: {
    marginRight: 12,
    alignItems: "flex-start",
  },
  imageContainer: {
    width: 80,
    height: 100,
    marginRight: 12,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    // resizeMode: "contain",
  },
  itemInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemBrand: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 18,
    marginVertical: 4,
  },
  priceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // overflow: "hidden",
    alignItems: "center",
    gap: 10,
  },
  actionContainer: {
    flexDirection: "row",
    // alignItems: 'flex-start',
    justifyContent: "flex-end",
    // alignSelf: 'flex-end',
    gap: 10,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  savingsText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "600",
  },
  outOfStockText: {
    fontSize: 14,
    color: "#FF3B30",
    fontWeight: "600",
    paddingTop: 10,
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    minWidth: 80,
  },
  actionContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  // quantityButton: {
  //   width: 28,
  //   height: 28,
  //   borderRadius: 14,
  //   backgroundColor: "#fff",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 1,
  //   },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 2,
  //   elevation: 2,
  // },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginHorizontal: 12,
    // minWidth: 20,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    // backgroundColor: "#F8F9FA",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  couponContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 15,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  appliedCouponText: {
    color: "#4CAF50",
    fontWeight: "600",
    marginTop: 5,
  },
  shippingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectedShippingOption: {
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  shippingInfo: {
    flex: 1,
  },
  shippingName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  shippingTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  shippingPrice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  shippingPriceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  orderSummary: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyCartSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  continueShoppingButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  checkoutContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutLabel: {
    fontSize: 12,
    color: "#666",
  },
  checkoutTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  checkoutButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 150,
  },
  disabledCheckoutButton: {
    backgroundColor: "#D3D3D3",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  variantName: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1A1A1A",
    textAlign: "center",
  },
  addressCard: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#F8F9FA",
  },
  selectedAddressCard: {
    borderColor: "#007AFF",
    backgroundColor: "#E6F0FF",
  },
  addressName: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 1,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  selectedPaymentOption: {
    borderColor: "#007AFF",
    backgroundColor: "#E6F0FF",
  },
  paymentOptionText: {
    fontSize: 14,
    color: "#1A1A1A",
    marginLeft: 8,
    fontWeight: "500",
  },
});

export default CartPage;
