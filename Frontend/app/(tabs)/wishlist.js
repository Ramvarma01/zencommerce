import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
  // SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductContext } from "../../context/productContext";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMemo } from "react";

const { width } = Dimensions.get("window");

const WishlistPage = () => {
  const [products, , fetchProducts] = useContext(ProductContext);
  const [state, setState, getLocalStorageData] = useContext(AuthContext);
  const { user, token } = state;

  // Loading state
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   getLocalStorageData();
  //   // Wait for both products and user to be available
  //   if (products && products.length > 0 && user && user.wishlist) {
  //     setLoading(false);
  //   } else {
  //     setLoading(true);
  //   }
  // }, [products, user]);

  // Filter products based on user's wishlist IDs
  // const wishlistProducts =
  //   products && user && user.wishlist
  //     ? products.filter((product) =>
  //         user.wishlist.map(String).includes(String(product._id))
  //       )
  //     : [];

      const wishlistProducts = useMemo(
        () =>
          user?.wishlist
            ?.map((wishlistItem) => {
              const product = products.find((p) => p._id === wishlistItem);
              return product
            })
            .filter(Boolean).reverse() || [],
        [user, products]
      );

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="#007AFF" />
  //       <Text style={{ marginTop: 10 }}>Loading your wishlist...</Text>
  //     </View>
  //   );
  // }

  const removeFromWishlist = async (product) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // Check if user is logged in
              if (!user || !user._id) {
                Alert.alert(
                  "Error",
                  "Please login to remove products from wishlist"
                );
                return;
              }
              const { data } = await axios.delete(
                `/remove-product-from-wishlist/${user._id}`,
                { data: { product_id: product._id } }
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
                "Error removing product from wishlist";
              Alert.alert("Error", errorMessage);
              console.error("Error removing product from wishlist:", error);
            }
          },
        },
      ]
    );
  };

  const handleAddToCart = async (product) => {
    try {
      // Check if product is already in cart (new cart structure)
      const isInCart = user.cart.some(
        (cartItem) => cartItem.productId === product._id
      );
      if (isInCart) {
        return Alert.alert("Product already in cart");
      }

      // Prepare cart item data
      const cartItem = {
        productId: product._id,
        quantity: 1,
      };

      // Add variantId if product has variants
      if (
        product.hasVariant &&
        product.variants &&
        product.variants.length > 0
      ) {
        cartItem.variantId = product.variants[0]._id; // Default to first variant
      }

      const { data } = await axios.put(`/add-product-to-cart/${user._id}`, {
        cartItem: cartItem,
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
        error.response?.data?.message || "Error adding product to the Cart";
      Alert.alert("Error", errorMessage);
      console.error("Error adding product to Cart:", error);
    }
  };

  const moveAllToCart = () => {
    Alert.alert(
      "Move All to Cart",
      `Move all ${wishlistProducts.length} items to your cart?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Move All",
          onPress: () => {
            Alert.alert("Success", "All items moved to cart!");
          },
        },
      ]
    );
  };

  const clearWishlist = () => {
    Alert.alert(
      "Clear Wishlist",
      "Are you sure you want to clear your entire wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              // Check if user is logged in
              if (!user || !user._id) {
                Alert.alert(
                  "Error",
                  "Please login to remove products from wishlist"
                );
                return;
              }
              const { data } = await axios.delete(
                `/clear-wishlist/${user._id}`
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
                "Error removing product from wishlist";
              Alert.alert("Error", errorMessage);
              console.error("Error removing product from wishlist:", error);
            }
          },
        },
      ]
    );
  };

  const handleProductPress = (product) => {
    router.push(`/product/${product._id}`);
  };

  const renderProductCard = (product) => (
    <TouchableOpacity
      key={product._id}
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
    >
      {/* <View key={product._id} style={styles.productCard}> */}
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.productImage}
        />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromWishlist(product)}
        >
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
        {(product.hasVariant
          ? product.variants[0].quantity <= 0
          : product.quantity <= 0) && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.brandText}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= (product.rating || 0) ? "star" : "star-outline"}
                size={12}
                color={star <= (product.rating || 0) ? "#FFD700" : "#D3D3D3"}
              />
            ))}
          </View>
          <Text style={styles.reviewsText}>(100)</Text>
        </View>

        <View style={styles.priceContainer}>
          {/* <Text style={styles.currentPrice}>₹{product.price}</Text> */}
          {product.hasVariant ? (
            <>
              <Text style={styles.currentPrice}>
                ₹{product.variants[0].price}
              </Text>
              <Text style={styles.originalPrice}>
                ₹{product.variants[0].originalPrice}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.currentPrice}>₹{product.price}</Text>
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            </>
          )}

          <Text style={styles.discountText}>
            {product.hasVariant
              ? Math.round(
                  ((product.variants[0].originalPrice -
                    product.variants[0].price) /
                    product.variants[0].originalPrice) *
                    100
                )
              : Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
            % OFF
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            (product.hasVariant
              ? product.variants[0].quantity <= 0
              : product.quantity <= 0) && styles.disabledButton,
          ]}
          onPress={() => handleAddToCart(product)}
          disabled={
            product.hasVariant
              ? product.variants[0].quantity <= 0
              : product.quantity <= 0
          }
        >
          <Ionicons name="cart-outline" size={16} color="#fff" />
          <Text style={styles.addToCartText}>
            {(
              product.hasVariant
                ? product.variants[0].quantity > 0
                : product.quantity > 0
            )
              ? "Add to Cart"
              : "Out of Stock"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* </View> */}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="heart-outline" size={80} color="#D3D3D3" />
      <Text style={styles.emptyStateTitle}>Your wishlist is empty</Text>
      <Text style={styles.emptyStateSubtitle}>
        Start adding items you love to your wishlist
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push("/search")}
      >
        <Text style={styles.browseButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wishlist</Text>
        {wishlistProducts.length > 0 && (
          //  <View style={styles.headerActions}>
          //  <TouchableOpacity
          //     style={styles.headerButton}
          //     onPress={moveAllToCart}
          //   >
          //     <Ionicons name="cart-outline" size={20} color="#007AFF" />
          //     <Text style={styles.headerButtonText}>Move All</Text>
          //   </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={clearWishlist}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={[styles.headerButtonText, { color: "#FF3B30" }]}>
              Clear
            </Text>
          </TouchableOpacity>
          //  </View>
        )}
      </View>

      {wishlistProducts.length > 0 ? (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.productsContainer}>
            {wishlistProducts.map(renderProductCard)}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        renderEmptyState()
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
    paddingVertical: 10,
    // paddingTop: 35,
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
  headerActions: {
    flexDirection: "row",
    gap: 15,
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  scrollView: {
    flex: 1,
  },
  productsContainer: {
    padding: 15,
    gap: 15,
  },
  productCard: {
    backgroundColor: "#fff",
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
  productImageContainer: {
    width: "100%",
    height: 200,
    position: "relative",
    marginBottom: 10,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "contain",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  outOfStockText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  productInfo: {
    gap: 8,
  },
  brandText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 1,
  },
  reviewsText: {
    fontSize: 12,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  originalPrice: {
    fontSize: 14,
    color: "#999",
    textDecorationLine: "line-through",
  },
  discountText: {
    fontSize: 12,
    color: "#FF3B30",
    fontWeight: "600",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: "#D3D3D3",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default WishlistPage;
